import Link from "next/link";
import { Store, Star, Check } from "lucide-react";

interface Props {
  seller: any;
}

export default function SellerCard({ seller }: Props) {
  // ✅ ADD DEBUGGING
  console.log("SellerCard seller data:", {
    name: seller.name,
    logo: seller.logo,
    image: seller.image,
    hasLogo: !!seller.logo,
    hasImage: !!seller.image,
  });

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {/* ✅ CHECK IF VALUE EXISTS AND IS NOT EMPTY STRING */}
            {(seller.logo && seller.logo.trim() !== "") ||
            (seller.image && seller.image.trim() !== "") ? (
              <img
                src={seller.logo || seller.image}
                alt={seller.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // ✅ FALLBACK IF IMAGE FAILS TO LOAD
                  console.error(
                    "Image failed to load:",
                    seller.logo || seller.image,
                  );

                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center">
                <Store size={24} className="text-white" />
              </div>
            )}
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

            {seller.rating && seller.reviewCount > 0 ? (
              <div className="flex items-center gap-1 mb-0.5">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">{seller.rating}</span>
                <span className="text-xs text-gray-500">
                  ({seller.reviewCount})
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mb-0.5">No reviews yet</p>
            )}

            <p className="text-xs text-gray-600">
              {seller.followers?.toLocaleString() || 0} followers
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
