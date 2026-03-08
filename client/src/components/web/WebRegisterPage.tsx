"use client";

import { useState } from "react";
import { WebPage, Card, Input, Button } from "./WebScaffold";
import { register as registerApi } from "../../lib/api";

export default function WebRegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const scientificName = (form.elements.namedItem("scientificName") as HTMLInputElement).value;
    const commonName = (form.elements.namedItem("commonName") as HTMLInputElement).value;
    const quantity = (form.elements.namedItem("quantity") as HTMLInputElement).value;
    setSubmitting(true);
    try {
      await registerApi({ scientificName, commonName, quantity });
      setShowSuccessModal(true);
      form.reset();
    } catch (err) {
      console.error(err);
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <WebPage
      title="개체 등록 (보관)"
      headerLinks={[
        { href: "/web/main", label: "메인" },
        { href: "/web/profile", label: "프로필" },
      ]}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_420px] gap-6">
        <Card className="bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">개체 등록</h2>
          <p className="mt-2 text-sm text-slate-600">
            보유한 생물 개체를 등록합니다. 학명(scientific name), 일반명, 수량을 입력하면 해당 회원의 보유 목록에 저장됩니다.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">등록 정보</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <Input id="register-scientific-name" name="scientificName" label="학명 (scientific name)" type="text" placeholder="예: Correlophus ciliatus" required />
            <Input id="register-common-name" name="commonName" label="일반명" type="text" placeholder="예: 크레스티드 게코" />
            <Input id="register-quantity" name="quantity" label="수량" type="number" min={1} placeholder="1" required />
            {showSuccessModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                role="alertdialog"
                aria-live="polite"
              >
                <div className="max-w-sm rounded-xl bg-white p-5 shadow-lg">
                  <p className="text-slate-800">정상적으로 등록되었습니다.</p>
                  <button
                    type="button"
                    onClick={() => setShowSuccessModal(false)}
                    className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            {showErrorModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                role="alertdialog"
                aria-live="assertive"
              >
                <div className="max-w-sm rounded-xl bg-white p-5 shadow-lg">
                  <p className="text-slate-800">
                    등록 중 일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowErrorModal(false)}
                    className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            <div className="pt-2">
              <Button type="submit" disabled={submitting}>{submitting ? "등록 중..." : "등록 완료"}</Button>
            </div>
          </form>
          <p className="text-sm text-slate-500">
            일반명 입력 시 학명 자동 매핑이 지원됩니다. (예: &quot;크레스티드게코&quot; → Correlophus ciliatus)
          </p>
        </Card>
      </div>
    </WebPage>
  );
}
