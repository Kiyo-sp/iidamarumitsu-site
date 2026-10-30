// 会社の確定情報。ここ以外に電話番号・住所を書かない。
export const COMPANY = {
  name: "株式会社飯田丸光部品",
  shortName: "飯田丸光部品",
  tel: "0265-23-1231",
  telHref: "tel:0265231231",
  hours: "平日 8:30〜17:30",
  address: "〒395-0053 長野県飯田市大久保町2565-6",
  stores: [
    { name: "本店", area: "飯田市中心部", address: "〒395-0053 長野県飯田市大久保町2565-6", map: "長野県飯田市大久保町2565-6" },
    { name: "生田店", area: "飯田の北側", address: "〒399-3302 長野県下伊那郡松川町生田900-1", map: "長野県下伊那郡松川町生田900-1" },
  ],
  mercari: "https://jp.mercari.com/shops/profile/2JN44BXf6XfXYJMbBeU7yr",
  url: "https://iidamarumitsu.jp",
};

// 下書きを公開ビルドに出さない。プレビュー時だけ PREVIEW_DRAFTS=1 で含める
export const showDrafts = process.env.PREVIEW_DRAFTS === "1";
export const isPublic = (status: string) => status === "approved" || showDrafts;

export const ym = (s: string) => {
  const [y, m] = s.split("-");
  return `${y}年${Number(m)}月`;
};

// 取扱い（仕入実績で確認済みのものだけ）
export const GENUINE_MAKERS = ["トヨタ", "日産", "ホンダ", "スズキ", "ダイハツ", "スバル", "三菱", "マツダ", "いすゞ", "三菱ふそう"];
export const AFTERMARKET_MAKERS = ["日本マイクロフィルター工業", "トキコ", "GMB", "バンドー化学", "大野ゴム工業", "日本特殊陶業", "デンソー", "DIXCEL", "武蔵オイルシール工業", "スタンレー電気"];
export const POPULAR_PARTS = ["ワイパーゴム", "オイルエレメント", "ブレーキパッド", "ファンベルト", "エアコンフィルター", "エアエレメント", "スタビライザーリンク", "スパークプラグ", "ブーツ類", "ブレーキシュー", "アッパーマウント", "ウォーターポンプ"];
