import { useState, useEffect, useMemo, FC, FormEvent, ChangeEvent } from 'react';
import Head from 'next/head';

interface Product {
  id: string;
  name: string;
  scent: string;
  price: number;
  originalPrice: number;
  features: string[];
  gradient: string[];
}

interface CartItem extends Product {
  quantity: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const PrickleysStore = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', address: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  const products: Product[] = useMemo(() => [
    {
      id: '1',
      name: 'Lemon Fresh',
      scent: 'Lemon Scented',
      price: 240,
      originalPrice: 300,
      features: ['Moisturizes Skin', 'Kills 99.9% Germs', 'Refreshing Lemon Fragrance'],
      gradient: ['#fde047', '#facc15', '#fbbf24'],
    },
    {
      id: '2',
      name: 'Red Fruit Burst',
      scent: 'Red Fruit Scented',
      price: 240,
      originalPrice: 300,
      features: ['Moisturizes Skin', 'Kills 99.9% Germs', 'Sweet Red Fruit Fragrance'],
      gradient: ['#f87171', '#ef4444', '#dc2626'],
    },
    {
      id: '3',
      name: 'Lavender Breeze',
      scent: 'Lavender Scented',
      price: 240,
      originalPrice: 300,
      features: ['Moisturizes Skin', 'Kills 99.9% Germs', 'Calming Lavender Fragrance'],
      gradient: ['#c084fc', '#a855f7', '#9333ea'],
    },
  ], []);

  // Add product to cart or increase quantity
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Update quantity in cart
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate total price
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\d{9,15}$/.test(formData.phone.replace(/\D/g, ''))) errors.phone = 'Invalid phone number';
    if (!formData.address.trim()) errors.address = 'Address is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle order submission
  const handleOrderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cart.length === 0) {
      alert('Your cart is empty. Please add products before ordering.');
      return;
    }

    // Compose email body
    const bodyLines = [
      `Order from: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Address: ${formData.address}`,
      '',
      'Order details:',
    ];
    cart.forEach((item) => {
      bodyLines.push(`- ${item.name} (${item.scent}) x${item.quantity} = Ksh ${item.price * item.quantity}`);
    });
    bodyLines.push('', `Total: Ksh ${total}`);

    const mailtoLink = `mailto:prickleysofficial254@gmail.com?subject=New%20Order%20from%20Prickleys%20Store&body=${encodeURIComponent(
      bodyLines.join('\n')
    )}`;

    window.location.href = mailtoLink;
    setOrderSuccess(true);
    setCart([]);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setIsCartOpen(false);
  };

  // Animated gradient orb for product
  const GradientOrb: FC<{ colors: string[] }> = ({ colors }) => {
    return (
      <div className="orb" aria-hidden="true">
        <style jsx>{`
          .orb {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(270deg, ${colors.join(', ')});
            background-size: 600% 600%;
            animation: gradientShift 8s ease infinite;
            box-shadow: 0 0 15px ${colors[1]};
            margin-bottom: 1rem;
          }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Prickleys Handwash Store</title>
        <meta name="description" content="Affordable, moisturizing handwash that kills 99.9% germs with delightful fragrances." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        :root {
          --primary-color: #9333ea;
          --secondary-color: #fbbf24;
          --background-gradient: linear-gradient(135deg, #f3e8ff, #fef3c7);
          --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          --shadow: rgba(0, 0, 0, 0.1);
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: var(--font-family);
          background: var(--background-gradient);
          color: #333;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem 3rem;
        }
        h1 {
          margin-top: 2rem;
          font-weight: 700;
          color: var(--primary-color);
          text-align: center;
        }
        .products {
          display: flex;
          gap: 2rem;
          margin: 2rem 0 3rem;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 960px;
          width