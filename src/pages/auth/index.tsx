import { ClerkSignInWrapper, ClerkSignUpWrapper } from '../../features/auth';

export function LoginPage() {
  return (
    <div className="space-y-4 w-full text-left">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold m-0">Đăng nhập tài khoản</h3>
        <p className="text-xs text-gray-500 m-0 mt-1">Chọn phương thức đăng nhập thông qua Clerk để tiếp tục</p>
      </div>
      <ClerkSignInWrapper />
    </div>
  );
}

export function RegisterPage() {
  return (
    <div className="space-y-4 w-full text-left">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold m-0">Đăng ký tài khoản</h3>
        <p className="text-xs text-gray-500 m-0 mt-1">Đăng ký thành viên Yami Music để nhận nhiều ưu đãi</p>
      </div>
      <ClerkSignUpWrapper />
    </div>
  );
}
