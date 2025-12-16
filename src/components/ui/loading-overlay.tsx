import Loader from "./Loader/Loader";
import { Skeleton } from "./skeleton";

interface LoadingOverlayProps {
  isLoading: boolean;
  activeTab?: 'cryptoToCash' | 'cashToCrypto' | 'cryptoToLoan'
}

export function LoadingOverlay({ isLoading, activeTab = 'cryptoToCash' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex gap-3 border border-[#E0E0E0]">
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-full" />
        </div>

        {activeTab === 'cryptoToCash' ? (
          <div className="space-y-6">
            <div className="border border-[#E0E0E0] rounded-3xl p-4 space-y-3">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32 rounded-full" />
              </div>
            </div>

            <div className="border border-[#E0E0E0] rounded-3xl p-4 space-y-3">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32 rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-16 w-full rounded-3xl" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-16 w-full rounded-3xl" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <Skeleton className="h-10 w-48 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-16 w-full rounded-3xl" />
            </div>
          </div>
        )}

        {/* <Skeleton className="h-16 w-full rounded-3xl bg-[#013941]/10" /> */}

        <div className="flex items-center justify-center gap-2 text-[#013941]">
          <Loader type='bars' width={40} height={40} color="#013941" />
          <span className="text-sm font-medium">
            {activeTab === 'cryptoToCash' ? 'Processing conversion...' : 'Submitting...'}
          </span>
        </div>
      </div>
    </div>
  )
}