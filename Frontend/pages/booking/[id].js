import { useRouter } from "next/router";

export default function Booking() {
  const router = useRouter();
  const { id } = router.query;

  return <h1>Booking & Payment for Property {id}</h1>;
}
