import { Button, Separator } from "../ui";

function AppFooter() {
  return (
    <footer className="w-full flex items-center justify-center p-9 ">
      <div className="w-full max-w-[1328px] flex flex-col items-center justify-center gap-6">
        <div className="w-full flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="w-full flex items-start justify-between gap-4 md:w-fit md:flex-col ">
            <div className="flex flex-col">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
                새로운 여행의 시작
              </h3>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
                현지에서 편하게 만나는 나만의 친구
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size={"icon"}>
                <img src="/icons/youtube.svg " alt="@YOUTUBE" className="w-6" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-13">
              <p> 이용약관</p>
              <Separator orientation="vertical" className="h-3!" />
              <p> 개인정보처리 방침</p>
              <Separator orientation="vertical" className="h-3!" />
              <p> 문의</p>
            </div>
            <Button variant="outline"> 고객센터 연결하기 </Button>
          </div>
        </div>
        <Separator />
        <div className="w-full flex flex-col items-start gap-18 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <p className="text-base font-semibold">고객센터 </p>
            <div className="flex flex-col gap-13">
              <div className="flex flex-col gap-1">
                <p> 평일 오전 9시 ~ 오후 6시</p>
                <p> 문의 : service@gmail.com</p>
              </div>
              <p>©LocalMate all rights reserved</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-base font-semibold"> 사업자정보</p>
            <div className="flex flex-col gap-1">
              <p> 대표 : 홍길동</p>
              <p> 사업자 번호 : xxx-xx-xxxx</p>
              <p> 통신판매신고번호 : 2025-xxxx-xxxx</p>
              <p> 주소 : 서울특별시 xx구 xx대로 xx길 xx</p>
              <p> 대표번호 : xxx-xxxx-xxxx</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { AppFooter };
