"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const { user, signIn, signUp, signOut } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
    } else {
      setIsLoginOpen(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(error);
    } else {
      setIsSignUpOpen(false);
      setEmail("");
      setPassword("");
      setFullName("");
      alert("تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ForexReview
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link href="#brokers" className="text-sm font-medium hover:text-primary transition-colors">
              الشركات
            </Link>
            <Link href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">
              التقييمات
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              عن الموقع
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{user.full_name || user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>
                  تسجيل الدخول
                </Button>
                <Button size="sm" onClick={() => setIsSignUpOpen(true)}>
                  إنشاء حساب
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                الرئيسية
              </Link>
              <Link href="#brokers" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                الشركات
              </Link>
              <Link href="#reviews" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                التقييمات
              </Link>
              <Link href="#about" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                عن الموقع
              </Link>
              
              {user ? (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <span className="text-sm font-medium">{user.full_name || user.email}</span>
                  <Button variant="ghost" onClick={signOut}>
                    <LogOut className="w-4 h-4 ml-2" />
                    تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}>
                    تسجيل الدخول
                  </Button>
                  <Button onClick={() => { setIsSignUpOpen(true); setIsMenuOpen(false); }}>
                    إنشاء حساب
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent onClose={() => setIsLoginOpen(false)}>
          <DialogHeader>
            <DialogTitle>تسجيل الدخول</DialogTitle>
            <DialogDescription>
              أدخل بياناتك للوصول إلى حسابك
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ليس لديك حساب؟{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  setIsLoginOpen(false);
                  setIsSignUpOpen(true);
                }}
              >
                إنشاء حساب
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
        <DialogContent onClose={() => setIsSignUpOpen(false)}>
          <DialogHeader>
            <DialogTitle>إنشاء حساب جديد</DialogTitle>
            <DialogDescription>
              أنشئ حسابك لإضافة تقييماتك
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignUp} className="space-y-4 mt-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">الاسم الكامل</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="محمد أحمد"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              إنشاء حساب
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  setIsSignUpOpen(false);
                  setIsLoginOpen(true);
                }}
              >
                تسجيل الدخول
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
