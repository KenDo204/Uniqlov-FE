import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Home, ChevronLeft } from '@/components/ui/icons';

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
            className={`flex items-center gap-1 bg-primary-color transition-colors duration-200 font-medium ${className}`}
            sx={{
                textTransform: 'none',
                fontSize: '1rem',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'var(--primary-color)',
                },
            }}
        >
            <Home size={18} className="mr-1" />
            Trở về Trang chủ
        </Button>
    );
};

export default BackHome;
