
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Button asChild size="lg">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.cart_id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full sm:w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        <Link to={`/products/${item.id}`} className="hover:text-blue-600 transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-lg font-bold text-gray-900 mb-4">${item.price}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button variant="outline" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.cart_id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} (×{item.quantity})
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {getTotalPrice() > 50 ? 'Free' : '$9.99'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(getTotalPrice() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${(getTotalPrice() + (getTotalPrice() > 50 ? 0 : 9.99) + (getTotalPrice() * 0.08)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button asChild size="lg" className="w-full mt-6">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                
                {getTotalPrice() < 50 && (
                  <p className="text-sm text-gray-600 text-center mt-4">
                    Add ${(50 - getTotalPrice()).toFixed(2)} more for free shipping!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
