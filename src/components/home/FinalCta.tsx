import { Button } from "@/components/ui/Button";

/** نداء ختامي واحد قبل الفوتر: سؤال مباشر وزر واحد. */
export function FinalCta() {
  return (
    <section className="section" id="join" aria-label="انضم إلى احتياج">
      <div className="wrap">
        <div className="section-head">
          <h2>لنبدأ من الاحتياج.</h2>
        </div>

        <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-3.5 rounded-[22px] border border-[color:var(--line)] bg-[rgba(234,242,245,0.04)] p-8 text-center">
          <h3 className="text-[clamp(1.2rem,2.2vw,1.6rem)] font-bold">
            هل لديك احتياج صحي؟
          </h3>
          <p className="m-0 text-[0.95rem] leading-[1.8] text-muted">
            سجّل احتياجك بنفسك في دقائق، وتابع حالته حتى تصل الاستجابة.
          </p>
          <Button
            href="/register/beneficiary"
            variant="cta"
            size="lg"
            withArrow
            className="mt-2"
          >
            سجّل كمستفيد
          </Button>
        </div>
      </div>
    </section>
  );
}
