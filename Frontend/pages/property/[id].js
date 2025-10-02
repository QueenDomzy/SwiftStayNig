import { useRouter } from "next/router";

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  return <h1>Property Details for {id}</h1>;
}
