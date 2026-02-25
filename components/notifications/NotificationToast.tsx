"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  imageUrl?: string;
  productId?: string;
  sellerId?: string;
}

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export default function NotificationToast({
  notification,
  onClose,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getLink = () => {
    if (notification.productId) return `/product/${notification.productId}`;
    if (notification.sellerId) return `/store/${notification.sellerId}`;
    return "#";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-24 right-4 z-[60] w-96 max-w-[calc(100vw-2rem)]"
        >
          <Link href={getLink()} onClick={handleClose}>
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-4 hover:shadow-3xl transition-shadow cursor-pointer">
              <div className="flex items-start gap-3">
                {/* Icon or Image */}
                <div className="flex-shrink-0">
                  {notification.imageUrl ? (
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={notification.imageUrl}
                        alt="Notification"
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-black to-gray-700 flex items-center justify-center">
                      <Package size={24} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm line-clamp-1">
                      {notification.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClose();
                      }}
                      className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    Click to view →
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
