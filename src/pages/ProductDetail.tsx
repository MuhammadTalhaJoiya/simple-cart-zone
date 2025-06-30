
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';

// Mock product data (in real app, this would come from API)
const productData = {
  1: {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"
    ],
    rating: 4.8,
    reviews: 124,
    category: "Electronics",
    inStock: true,
    stockCount: 15,
    description: "Experience premium audio quality with these wireless headphones featuring advanced noise cancellation technology, premium materials, and exceptional comfort for all-day wear.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Premium leather ear cups",
      "Bluetooth 5.0 connectivity",
      "Quick charge (15 min = 3 hours)",
      "Built-in microphone"
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 40kHz",
      "Impedance": "32 ohms",
      "Weight": "250g",
      "Battery Life": "30 hours",
      "Charging Time": "2 hours"
    }
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');

  const product = productData[id as keyof typeof productData];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-gray-600 ml-2">({product.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            {product.inStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-900">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleAddToCart} size="lg" className="flex-1">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">2 Year Warranty</p>
                  <p className="text-sm text-gray-600">Full protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">30-Day Returns</p>
                  <p className="text-sm text-gray-600">No questions asked</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card>
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium capitalize transition-colors ${
                    selectedTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <CardContent className="p-6">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
                <h4 className="font-semibold text-gray-900 mb-3">Features & Benefits</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold">{product.rating}</div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">Based on {product.reviews} reviews</p>
                  </div>
                </div>

                {/* Sample reviews */}
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="font-medium">John D.</span>
                      <span className="text-gray-600">2 days ago</span>
                    </div>
                    <p className="text-gray-600">Absolutely love these headphones! The sound quality is incredible and they're so comfortable to wear for hours.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;
