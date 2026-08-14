import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, Cart } from '@/app/services/cart.service';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems, updateCartCount } from '../redux/slices/cartSlice';
import { toast } from 'sonner';
import { RootState } from '../redux/store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const getCartItemCount = (cart: Cart) =>
  cart.items.reduce((sum, item) => sum + item.quantity, 0);

const updateCartState = (
  cart: Cart,
  queryClient: ReturnType<typeof useQueryClient>,
  dispatch: ReturnType<typeof useDispatch>
) => {
  queryClient.setQueryData(['cart'], cart);
  dispatch(setCartItems(cart.items));
  dispatch(updateCartCount(getCartItemCount(cart)));
};

export const useGetCart = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === 'updated' &&
        event.query.queryKey[0] === 'cart' &&
        event.action.type === 'success'
      ) {
        const data = event.query.state.data as Cart;
        if (data) {
          const itemCount = data.items.reduce((sum, item) => sum + item.quantity, 0);
          dispatch(setCartItems(data.items));
          dispatch(updateCartCount(itemCount));
        }
      }
      
      if (
        event.type === 'updated' &&
        event.query.queryKey[0] === 'cart' &&
        event.action.type === 'error'
      ) {
        dispatch(updateCartCount(0));
      }
    });

    return () => unsubscribe();
  }, [queryClient, dispatch]);

  return useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItemCount = useSelector((state: RootState) => state.cart.itemCount);

  const mutation = useMutation({
    mutationFn: cartService.addToCart,
    
    onMutate: async (newItem) => {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
        throw new Error('Not authenticated');
      }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<Cart>(['cart']);

      // Optimistically update cart count in Redux
      dispatch(updateCartCount(cartItemCount + newItem.quantity));

      return { previousCart };
    },

    onError: (error: any, newItem, context) => {
      if (error.message === 'Not authenticated') return;

      // Rollback to previous cart state
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
        const itemCount = context.previousCart.items.reduce(
          (sum: number, item: any) => sum + item.quantity, 
          0
        );
        dispatch(updateCartCount(itemCount));
      }
      
      const errorMessage = error?.response?.data?.message || 'Failed to add item to cart';
      toast.error(errorMessage);
    },

    onSuccess: () => {
      toast.success('Item added to cart successfully!');
    },

    onSettled: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
  });

  return {
    addToCart: mutation.mutateAsync,
    isAdding: mutation.isPending,
  };
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const mutation = useMutation({
    mutationFn: cartService.removeCartItem,

    onMutate: async (itemId) => {
      if (!isAuthenticated) {
        toast.error('Session expired. Please sign in again.');
        router.push('/login');
        throw new Error('Not authenticated');
      }

      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<Cart>(['cart']);

      if (previousCart) {
        const optimisticCart = {
          ...previousCart,
          items: previousCart.items.filter((item) => item.id !== itemId),
          updatedAt: new Date().toISOString(),
        };

        updateCartState(optimisticCart, queryClient, dispatch);
      }

      return { previousCart, itemId };
    },

    onError: (error: any, itemId, context) => {
      if (error.message === 'Not authenticated') return;

      const status = error?.response?.status;

      if (status === 404) {
        const currentCart = queryClient.getQueryData<Cart>(['cart']);
        const cartToSync = currentCart || context?.previousCart;

        if (cartToSync) {
          updateCartState(
            {
              ...cartToSync,
              items: cartToSync.items.filter((item) => item.id !== itemId),
            },
            queryClient,
            dispatch
          );
        }

        toast.error('That item is no longer in your cart.');
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        return;
      }

      if (context?.previousCart) {
        updateCartState(context.previousCart, queryClient, dispatch);
      }

      if (status === 401) {
        toast.error('Session expired. Please sign in again.');
        router.push('/login');
        return;
      }

      if (status === 400) {
        toast.error('Invalid cart item.');
        return;
      }

      toast.error('Could not remove item. Please try again.');
    },

    onSuccess: (updatedCart) => {
      updateCartState(updatedCart, queryClient, dispatch);
      toast.success('Item removed from cart.');
    },
  });

  return {
    removeCartItem: mutation.mutateAsync,
    isRemoving: mutation.isPending,
  };
};
