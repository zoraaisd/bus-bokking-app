import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export function UserHeader({ title, subtitle, showBack = false }: UserHeaderProps) {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid #F3F4F6',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        maxWidth: 560,
        margin: '0 auto',
        padding: '0 16px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        {showBack && (
          <motion.button
            id="header-back-btn"
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate(-1)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#F9FAFB', border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <ChevronLeft size={20} color="#374151" />
          </motion.button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'Poppins', fontWeight: 700, fontSize: 15,
            color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </p>
          {subtitle && (
            <p style={{
              fontFamily: 'Inter', fontSize: 12, color: '#6B7280',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1,
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
