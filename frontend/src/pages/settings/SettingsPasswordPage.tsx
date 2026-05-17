import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

export default function SettingsPasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // 실시간 유효성 체크 (새 비밀번호와 확인창 입력값이 일치하는지)
  const isFormValid =
    formData.currentPassword &&
    formData.newPassword &&
    formData.newPassword === formData.newPasswordConfirm;

  // [API] 최종 비밀번호 변경 처리
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 🚨 TODO: [API 연동] 비밀번호 변경 호출 (PATCH /api/users/me/password)
    /*
    try {
      await api.patch('/api/users/me/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage("현재 비밀번호가 일치하지 않거나 변경 조건에 맞지 않습니다.");
    }
    */
    setShowSuccess(true); // 임시 성공 처리
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // 명세서 규칙: 성공 시 모든 refresh_token 삭제 후 로그인 화면으로 이동
    navigate("/auth/login");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 상단 헤더 */}
      <div className="px-6 py-5 border-b border-border flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="flex-1 text-center font-semibold pr-10">비밀번호 변경</h2>
      </div>

      {/* 본문 입력 영역 */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              현재 비밀번호
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              placeholder="현재 비밀번호를 입력해 주세요"
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              새 비밀번호
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder="새 비밀번호 (8자 이상, 영문+숫자+특수문자)"
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={formData.newPasswordConfirm}
              onChange={(e) =>
                setFormData({ ...formData, newPasswordConfirm: e.target.value })
              }
              placeholder="새 비밀번호 다시 입력"
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
            {formData.newPasswordConfirm &&
              formData.newPassword !== formData.newPasswordConfirm && (
                <p className="text-xs text-destructive mt-1.5">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
          </div>

          {errorMessage && (
            <p className="text-xs text-destructive mt-1.5 px-1">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-2xl font-semibold transition-all mt-8 ${
              isFormValid
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            비밀번호 변경 완료
          </button>
        </form>
      </div>

      {/* 성공 팝업 모달 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-[320px] w-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Check size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">변경 완료</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              비밀번호가 안전하게 변경되었습니다. 보안을 위해 로그아웃 처리가 완료되오니 다시 로그인해 주세요.
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}