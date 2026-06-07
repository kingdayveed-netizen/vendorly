"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

const AccountSkeleton = () => {
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-between mb-8">
					<div className="space-y-2 w-full max-w-md">
						<Skeleton className="h-8 w-40" />
						<Skeleton className="h-4 w-64" />
					</div>
					<Skeleton className="h-10 w-28" />
				</div>

				{/* <Card className="mb-6">
					<CardHeader>
						<CardTitle className="text-base">Vendor Account Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					</CardContent>
				</Card> */}

				<Card>
					<CardHeader>
						{/* <CardTitle className="text-base">Payout account</CardTitle> */}
						<Skeleton className="text-base"/>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full md:col-span-2" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AccountSkeleton;
