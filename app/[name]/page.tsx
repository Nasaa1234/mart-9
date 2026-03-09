import PoemClient from "./PoemClient";
import { poems, defaultPoem, secretMessages, defaultSecret } from "../data/poems";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { name } = await params;
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  return {
    title: `${displayName}-д зориулсан шүлэг 🌸`,
    description: `Зөвхөн ${displayName}-д зориулж бичсэн шүлэг`,
  };
}

export default async function PoemPage({ params }: Props) {
  const { name } = await params;
  const key = name.toLowerCase();
  const poem = poems[key] || defaultPoem;
  const secret = secretMessages[key] || defaultSecret;

  return <PoemClient name={name} poem={poem} secretMessage={secret} />;
}
