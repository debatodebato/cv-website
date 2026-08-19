import imgRectangle1 from "./20755331764bb4f5b65a397e6bc239207461329a.png";

function Frame() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[24px] items-start relative shrink-0 text-black w-full">
      <p className="font-['Roboto_Serif:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[42px] whitespace-nowrap" style={{ fontVariationSettings: '"GRAD" 0, "wdth" 100' }}>
        Desirée Barreto
      </p>
      <div className="font-['Graphik:Regular',sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[24px] w-[min-content] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0">My creativity thrives where cultural pulse encounters systems design. Based in Dubai, I am a human-centred designer, strategist, and design educator, skilled at design systems, brand and CX strategy and go-to-market activation.</p>
        <p className="leading-[normal] mb-0">​</p>
        <p className="leading-[normal]">My experience spans strategic synthesis across categories (tech, ed, QSR, FMCG, hospitality, cultural institutions), operationalising strategy at scale, and leading cross-functional teams.</p>
      </div>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[117px] items-start pb-[60px] pt-[40px] px-[54px] relative rounded-[40px] size-full">
      <div className="h-[290.488px] relative rounded-[37.025px] shrink-0 w-[292.06px]">
        <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none rounded-[37.025px] size-full" src={imgRectangle1} />
      </div>
      <Frame />
    </div>
  );
}