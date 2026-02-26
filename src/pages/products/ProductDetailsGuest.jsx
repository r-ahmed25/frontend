// src/pages/products/ProductDetailsGuest.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../api/client";

export default function ProductDetailsGuest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`${API_URL}/public/products/${id}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load product");
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  /* ================= IMAGE CONTROLS ================= */
  const hasImages = product?.images?.length > 0;
  const currentImage = hasImages ? product.images[currentImageIndex] : null;

  const nextImage = () =>
    setCurrentImageIndex((i) => (i === product.images.length - 1 ? 0 : i + 1));

  const prevImage = () =>
    setCurrentImageIndex((i) => (i === 0 ? product.images.length - 1 : i - 1));

  if (loading)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-500 rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="theme-card bg-surface rounded-3xl p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">
            Error Loading Product
          </p>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 btn-theme-primary px-4 py-2 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-surface px-4 sm:px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        {/* ================= IMAGES ================= */}
        {product.images?.length > 0 && (
          <div className="theme-card bg-surface rounded-3xl shadow-2xl p-6">
            <div className="relative">
              <div className="aspect-square bg-surface-alt rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={currentImage.url}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-110"
                />
              </div>

              {hasImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 btn-theme-primary px-3 py-1 rounded-xl"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn-theme-primary px-3 py-1 rounded-xl"
                  >
                    ›
                  </button>
                </>
              )}

              {hasImages && product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                        i === currentImageIndex
                          ? "border-indigo-500"
                          : "border-white/30"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= DETAILS ================= */}
        <div className="space-y-6">
          <div className="theme-card bg-surface rounded-3xl shadow-2xl p-6">
            <h1 className="text-3xl font-bold hero-gradient-text mb-2">
              {product.name}
            </h1>
            {product.category && (
              <span className="inline-block text-xs font-semibold bg-surface-alt text-slate-700 px-3 py-1 rounded-full mb-2">
                {product.category}
              </span>
            )}
            <p className="text-slate-600 leading-relaxed">
              {product.description || "No description available."}
            </p>

          </div>

          {/* ================= ACTIONS ================= */}
          <div className="theme-card bg-surface rounded-3xl shadow-xl p-6">
            <div className="bg-surface-alt border border-white/30 rounded-2xl p-4 mb-4">
              <p className="text-sm text-slate-600">
                For pricing and purchase, please login or register.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full btn-theme-primary py-3 rounded-xl font-semibold"
              >
                Login to Continue
              </button>
              
              <button
                onClick={() => navigate("/register")}
                className="w-full btn-theme-secondary py-3 rounded-xl font-semibold"
              >
                Register to Purchase
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/products-guest")}
            className="btn-theme-primary px-6 py-3 rounded-xl font-semibold"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
