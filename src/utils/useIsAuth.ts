import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/auth?next=" + router.pathname);
    }
  }, [fetching, data, router]);

  if (!fetching && !data?.me) return false;
  else return true;
};
