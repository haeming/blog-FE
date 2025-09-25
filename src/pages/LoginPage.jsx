import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        console.log('로그인 시도:', formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* 로그인 카드 */}
                <div className="bg-custom-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {/* 헤더 */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">로그인</h1>
                        <p className="text-gray-600 text-sm">계정에 로그인하여 시작하세요</p>
                    </div>

                    {/* 로그인 폼 */}
                    <div className="space-y-5">
                        {/* 이메일 입력 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                이메일
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="example@email.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                                />
                            </div>
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="비밀번호를 입력하세요"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5"/>
                                    ) : (
                                        <Eye className="h-5 w-5"/>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 옵션들 */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="ml-2">로그인 상태 유지</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                                비밀번호 찾기
                            </a>
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            로그인
                        </button>
                    </div>

                    {/* 구분선 */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white text-gray-500">또는</span>
                        </div>
                    </div>

                    {/* 소셜 로그인 */}
                    <div className="space-y-3">
                        <button
                            className="w-full border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 bg-red-500 rounded"></div>
                            <span className="font-medium">Google로 계속하기</span>
                        </button>
                    </div>

                    {/* 회원가입 링크 */}
                    <p className="mt-8 text-center text-gray-600 text-sm">
                        계정이 없으신가요?{' '}
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            회원가입
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}