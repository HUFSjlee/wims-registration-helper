"use client";

import { useEffect, useRef, useState } from "react";
import { WebPage, Card, Input, Button } from "./WebScaffold";
import { getScientificNameByCommonName, register as registerApi } from "../../lib/api";

const LOOKUP_DEBOUNCE_MS = 450;

export default function WebRegisterPage() {
  const [scientificName, setScientificName] = useState("");
  const [commonName, setCommonName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const lookupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (lookupTimerRef.current) clearTimeout(lookupTimerRef.current);
    };
  }, []);

  async function runScientificLookup(raw: string) {
    const v = raw.trim();
    if (!v) {
      setScientificName("");
      return;
    }
    try {
      const { scientificName: sn } = await getScientificNameByCommonName(v);
      setScientificName(sn ?? "");
    } catch {
      // 로그인 전·네트워크 오류 등: 학명은 사용자가 입력한 값 유지
    }
  }

  function scheduleScientificLookup(raw: string) {
    if (lookupTimerRef.current) clearTimeout(lookupTimerRef.current);
    lookupTimerRef.current = setTimeout(() => {
      lookupTimerRef.current = null;
      void runScientificLookup(raw);
    }, LOOKUP_DEBOUNCE_MS);
  }

  function handleCommonNameBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (lookupTimerRef.current) {
      clearTimeout(lookupTimerRef.current);
      lookupTimerRef.current = null;
    }
    void runScientificLookup(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const quantity = (form.elements.namedItem("quantity") as HTMLInputElement).value;
    const sci = scientificName.trim();
    const com = commonName.trim();
    if (!sci && !com) {
      setErrorMessage("학명 또는 일반명 중 하나는 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      await registerApi({ scientificName: sci, commonName: com, quantity });
      setShowSuccessModal(true);
      setScientificName("");
      setCommonName("");
      form.reset();
    } catch (err) {
      console.error(err);
      setErrorMessage("등록 중 일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
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
            <Input
              id="register-scientific-name"
              name="scientificName"
              label="학명 (scientific name)"
              type="text"
              placeholder="예: Correlophus ciliatus"
              value={scientificName}
              onChange={(e) => setScientificName(e.target.value)}
            />
            <Input
              id="register-common-name"
              name="commonName"
              label="일반명"
              type="text"
              placeholder="예: 크레스티드 게코"
              value={commonName}
              onChange={(e) => {
                const val = e.target.value;
                setCommonName(val);
                scheduleScientificLookup(val);
              }}
              onBlur={handleCommonNameBlur}
            />
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
            {errorMessage && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                role="alertdialog"
                aria-live="assertive"
              >
                <div className="max-w-sm rounded-xl bg-white p-5 shadow-lg">
                  <p className="text-slate-800">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
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
            일반명은 입력 중·포커스를 벗어날 때 조회합니다. 공백 유무와 관계없이 같은 글자면 매칭됩니다. (예: 크레스티드게코 ↔ 크레스티드 게코) 로그인이 필요합니다.
          </p>
        </Card>
      </div>
    </WebPage>
  );
}
