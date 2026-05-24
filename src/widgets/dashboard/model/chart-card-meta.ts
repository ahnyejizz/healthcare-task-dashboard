export type ChartLegendItem = {
  colorKey: "todoStrong" | "doneStrong" | "primary";
  label: string;
};

export type ChartCardMeta = {
  description: string;
  legendItems?: ChartLegendItem[];
  title: string;
};

const progressLegendItems: ChartLegendItem[] = [
  { colorKey: "todoStrong", label: "해야할 일" },
  { colorKey: "doneStrong", label: "한 일" },
];

export const chartCards: ChartCardMeta[] = [
  {
    title: "카운트 비교",
    description: "전체 할 일, 남은 일, 완료한 일을 한눈에 비교할 수 있습니다.",
  },
  {
    title: "완료/잔여 비중",
    description: "전체 할 일 중 잔여 비중과 완료 비중을 도넛 차트로 확인합니다.",
    legendItems: progressLegendItems,
  },
  {
    title: "완료율",
    description: "현재 진행률을 게이지로 빠르게 파악합니다.",
    legendItems: progressLegendItems,
  },
  {
    title: "분포도",
    description: "남은 일과 완료한 일이 어느 정도 비중을 차지하는지 보여줍니다.",
  },
];
