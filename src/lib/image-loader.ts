export default function customImageLoader({
  src,
  width,
  quality
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // For external URLs, just return them as-is since we can't optimize them
  return src;
}