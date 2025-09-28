import { useState } from "react";
import { Eye, EyeOff, Lock, UserRound } from "lucide-react";
import useEnterSubmit from "../commons/hooks/useEnterSubmit";
import { useDispatch } from "react-redux";
import { login } from "../api/auth";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        accountName: '',
        password: ''
    });

    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        console.log('로그인 시도:', formData);
        dispatch(login(formData));
    };

    const handleKeyDown = useEnterSubmit(handleSubmit);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* 로그인 카드 */}
                <div className="bg-custom-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {/* 헤더 */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">로그인</h2>
                        <p className="text-gray-600 text-sm">계정에 로그인하여 시작하세요</p>
                    </div>

                    {/* 로그인 폼 */}
                    <div className="space-y-3">
                        {/* 이메일 입력 */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserRound className="h-5 w-5 text-gray-400"/>
                            </div>
                            <input
                                type="accountName"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="아이디"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-colors bg-white"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400"/>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="비밀번호"
                                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-colors bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5"/>
                                ) : (
                                    <Eye className="h-5 w-5"/>
                                )}
                            </button>
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-purple-400 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 cursor-pointer"
                        >
                            로그인
                        </button>
                    </div>

                    {/* <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white text-gray-500">또는</span>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}