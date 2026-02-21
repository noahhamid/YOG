import Link from "next/link";
import { Store, Star, Check } from "lucide-react";

interface Props {
  seller: any;
}

export default function SellerCard({ seller }: Props) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center">
            <Store size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold">{seller.name}</h3>
              {seller.verified && (
                <div className="bg-blue-500 text-white p-1 rounded-full">
                  <Check size={10} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 mb-0.5">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{seller.rating}</span>
            </div>
            <p className="text-xs text-gray-600">
              {seller.followers.toLocaleString()} followers
            </p>
          </div>
        </div>
        {seller.slug && (
          <Link href={`/store/${seller.slug}`}>
            <button className="px-4 py-1.5 border-2 border-black rounded-full font-semibold hover:bg-black hover:text-white text-sm">
              View Store
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
