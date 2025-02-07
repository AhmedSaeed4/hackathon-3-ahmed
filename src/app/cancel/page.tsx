import Link from 'next/link';

const CancelPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-clash items-center justify-center bg-gray-50 px-4">
      {/* Main Container */}
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon for Payment Failed */}
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900">
          Payment Not Completed
        </h1>

        {/* Subheading */}
        <p className="text-gray-600">
          It seems like your payment was not completed. Please try again or contact support if you need assistance.
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link
            href="/checkout" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;