import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ChevronLeft } from '@/components/ui/icons';

interface BackHomeProps {
    className?: string;
}

const BackHome: React.FC<BackHomeProps> = ({ className }) => {
    const navigate = useNavigate();

    return (
        <Button
            variant="text"
            startIcon={<ChevronLeft size={20} />}
            onClick={() => navigate('/')}
            className={`flex items-center gap-1 transition-colors duration-200 font-medium ${className}`}
            sx={{
                fontFamily: 'var(--font-sans)',
                textTransform: 'none',
                fontSize: '1rem',
                color: 'white',
                backgroundColor: 'var(--color-theme)',
                border: '1px solid transparent',
                '&:hover': {
                    backgroundColor: 'var(--color-theme-hover)',
                },
            }}
        >
            Quay lại trang chủ
        </Button>
    );
};

export default BackHome;
