import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
  FollowMutation,
  GetUserByIdQuery,
  GetUserByIdDocument,
  FollowMutationVariables,
  SaveScheduleMutation,
  GetSchedulesQuery,
  GetSchedulesDocument,
  UpdateInfoMutation,
  NotificationsQuery,
  NotificationsDocument,
  DocumentsQuery,
  DocumentsDocument,
  RelationshipsQuery,
  RelationshipsDocument,
} from "../generated/graphql";
import { pipe, tap } from "wonka";
import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import Router from "next/router";
import { isServer } from "./isServer";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      })
    );
  };

const cusorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });
    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

function invalidateAll(cache: Cache, fieldName: string) {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", fieldName, fi.arguments || {});
  });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    url: process.env.NEXT_PUBLIC_API_URL,
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cusorPagination(),
          },
        },
        updates: {
          Mutation: {
            // deletePost: (_result, args, cache, _info) => {
            // cache.invalidate({
            //   __typename: "Post",
            //   id: (args as DeletePostMutationVariables).id,
            // });
            // },

            follow: (_result, args, cache, _info) => {
              betterUpdateQuery<FollowMutation, GetUserByIdQuery>(
                cache,
                { query: GetUserByIdDocument },
                _result,
                (result, query) => {
                  if (result.follow) {
                    return query;
                  } else return query;
                }
              );
              invalidateAll(cache, "searchUser");
            },

            updateInfo: (_result, args, cache, _info) => {
              invalidateAll(cache, "updateInfo");
            },

            accept: (_result, args, cache, _info) => {
              betterUpdateQuery<FollowMutation, GetUserByIdQuery>(
                cache,
                { query: GetUserByIdDocument },
                _result,
                (result, query) => {
                  if (result.follow) {
                    return query;
                  } else return query;
                }
              );
              invalidateAll(cache, "searchUser");
            },

            unfollow: (_result, args, cache, _info) => {
              betterUpdateQuery<FollowMutation, GetUserByIdQuery>(
                cache,
                { query: GetUserByIdDocument },
                _result,
                (result, query) => {
                  if (result.follow) {
                    return query;
                  } else return query;
                }
              );
              invalidateAll(cache, "searchUser");
              invalidateAll(cache, "friends");
            },

            vote: (_result, args, cache, _info) => {
              // const { postId, value } = args as VoteMutationVariables;
              // const data = cache.readFragment(
              //   gql`
              //     fragment _ on Post {
              //       id
              //       points
              //       voteStatus
              //     }
              //   `,
              //   { id: postId } as any
              // );
              // if (data) {
              //   if (data.voteStatus === value) {
              //     return;
              //   }
              //   const newPoints =
              //     (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
              //   cache.writeFragment(
              //     gql`
              //       fragment _ on Post {
              //         points
              //         voteStatus
              //       }
              //     `,
              //     { id: postId, points: newPoints, voteStatus: value } as any
              //   );
              // }
            },

            saveDocument: (_result, _args, cache, _info) => {
              invalidateAll(cache, "documents");
              invalidateAll(cache, "document");
            },

            createPost: (_result, _args, cache, _info) => {
              invalidateAll(cache, "posts");
            },

            login: (_result, _args, cache, _info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else
                    return {
                      me: result.login.user,
                    };
                }
              );
              const allFields = cache.inspectFields("Query");
              allFields
                .filter((info) => info.fieldName === "getSchedules")
                .forEach((fi) => {
                  console.log(fi);
                  cache.invalidate("Query", "getSchedules");
                  cache.invalidate("Query", "getSchedules", fi.arguments);
                });
              allFields
                .filter((info) => info.fieldName === "notifications")
                .forEach((fi) => {
                  console.log(fi);
                  cache.invalidate("Query", "notifications");
                  cache.invalidate("Query", "notifications", fi.arguments);
                });
              allFields
                .filter((info) => info.fieldName === "relationships")
                .forEach((fi) => {
                  console.log(fi);
                  cache.invalidate("Query", "relationships", fi.arguments);
                  cache.invalidate("Query", "relationships");
                });
              allFields
                .filter((info) => info.fieldName === "documents")
                .forEach((fi) => {
                  console.log(fi);
                  cache.invalidate("Query", "documents");
                  cache.invalidate("Query", "documents", fi.arguments);
                });
            },
            updateSchedule: (_result, _args, cache, _info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "getUserFromSchedule"
              );
              fieldInfos.forEach((fi) => {
                console.log(fi);
                cache.invalidate("Query", "getUserFromSchedule", fi.arguments);
              });
            },
            register: (_result, _args, cache, _info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else
                    return {
                      me: result.register.user,
                    };
                }
              );
            },

            logout: (_result, _args, cache, _info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
              betterUpdateQuery<LogoutMutation, NotificationsQuery>(
                cache,
                { query: NotificationsDocument },
                _result,
                () => ({ notifications: [] })
              );
              betterUpdateQuery<LogoutMutation, GetSchedulesQuery>(
                cache,
                { query: GetSchedulesDocument },
                _result,
                () => ({ getSchedules: [] })
              );
              betterUpdateQuery<LogoutMutation, DocumentsQuery>(
                cache,
                { query: DocumentsDocument },
                _result,
                () => ({ documents: [] })
              );
              betterUpdateQuery<LogoutMutation, RelationshipsQuery>(
                cache,
                { query: RelationshipsDocument },
                _result,
                () => ({ relationships: [] })
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
