/** @format */

// const BG_COLORS = ["3b82f6", "c2175b"];

function defaultAvatar(slug: string) {
  // const bgColor = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];

  return `https://ui-avatars.com/api/?name=${slug}&size=100&background=3b82f6&color=fff&bold=true&font-size=0.5`;
}

export default defaultAvatar;
