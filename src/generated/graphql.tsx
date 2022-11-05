import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  relationships: Array<UserInfo>;
  searchUser: Array<UserInfo>;
  getUserById?: Maybe<UserInfo>;
  getUserFromSchedule: Array<User>;
  getUserDocument: Array<UserDocumentInfo>;
  getSchedules: Array<Schedule>;
  getSchedule?: Maybe<ScheduleValue>;
  documents?: Maybe<Array<Document>>;
  document?: Maybe<DocumentValue>;
  notifications?: Maybe<Array<Notification>>;
  messages?: Maybe<Array<Message>>;
};


export type QueryRelationshipsArgs = {
  id: Scalars['Float'];
};


export type QuerySearchUserArgs = {
  friend?: Maybe<Scalars['Boolean']>;
  search: Scalars['String'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['Float'];
};


export type QueryGetUserFromScheduleArgs = {
  scheduleId: Scalars['Float'];
};


export type QueryGetUserDocumentArgs = {
  options: GetUserDocumentInput;
};


export type QueryGetScheduleArgs = {
  id: Scalars['Float'];
};


export type QueryDocumentArgs = {
  id: Scalars['Float'];
};


export type QueryMessagesArgs = {
  room: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  fullname: Scalars['String'];
  email: Scalars['String'];
  avatar: Scalars['String'];
  banner: Scalars['String'];
  timeSpend: Scalars['Float'];
  joined: Scalars['Float'];
  cancel: Scalars['Float'];
  document: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};


export type UserInfo = {
  __typename?: 'UserInfo';
  id: Scalars['Float'];
  user: User;
  relationship?: Maybe<Scalars['String']>;
};

export type UserDocumentInfo = {
  __typename?: 'UserDocumentInfo';
  user: User;
  isAbsent: Scalars['Boolean'];
};

export type GetUserDocumentInput = {
  members: Array<Scalars['Float']>;
  absents: Array<Scalars['Float']>;
};

export type Schedule = {
  __typename?: 'Schedule';
  id: Scalars['Float'];
  title: Scalars['String'];
  dateType: Scalars['String'];
  startAt: Scalars['String'];
  hostId: Scalars['Float'];
  host: User;
  description: Scalars['String'];
  banner: Scalars['String'];
  company: Scalars['String'];
  users: Array<UserSchedule>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UserSchedule = {
  __typename?: 'UserSchedule';
  userId: Scalars['Float'];
  scheduleId: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type ScheduleValue = {
  __typename?: 'ScheduleValue';
  schedule: Schedule;
  users: Array<User>;
};

export type Document = {
  __typename?: 'Document';
  id: Scalars['Float'];
  title: Scalars['String'];
  logo: Scalars['String'];
  record: Scalars['String'];
  recordStartedAt: Scalars['Float'];
  transcripts: Array<Transcript>;
  moreInfo: Scalars['String'];
  startedAt: Scalars['String'];
  duration: Scalars['Float'];
  members: Scalars['String'];
  absents: Scalars['String'];
  scheduleId: Scalars['Float'];
  schedule: Schedule;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Transcript = {
  __typename?: 'Transcript';
  id: Scalars['Float'];
  context: Scalars['String'];
  type: Scalars['String'];
  userId: Scalars['Float'];
  user: User;
  documentId: Scalars['Float'];
  startedAt: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type DocumentValue = {
  __typename?: 'DocumentValue';
  document: Document;
  users: Array<User>;
  isabsent: Array<Scalars['Boolean']>;
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['Float'];
  content: Scalars['String'];
  type: Scalars['String'];
  isSeen: Scalars['Boolean'];
  user: User;
  url: Scalars['String'];
  receiver: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['Float'];
  context: Scalars['String'];
  type: Scalars['String'];
  userId: Scalars['Float'];
  user: User;
  room: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createMeeting: Scalars['String'];
  eraseMeeting: Scalars['Boolean'];
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  updateInfo?: Maybe<User>;
  follow: Scalars['Boolean'];
  accept: Scalars['Boolean'];
  unfollow: Scalars['Boolean'];
  saveSchedule?: Maybe<Schedule>;
  deleteSchedule: Scalars['Boolean'];
  updateSchedule: Schedule;
  saveDocument?: Maybe<Scalars['Float']>;
  updateDocument: Scalars['Boolean'];
  createNotification?: Maybe<Notification>;
  seenNotification: Scalars['Boolean'];
  chat: Message;
  updateMessage: Scalars['Boolean'];
  deleteMessage: Scalars['Boolean'];
};


export type MutationEraseMeetingArgs = {
  code: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationUpdateInfoArgs = {
  document?: Maybe<Scalars['Float']>;
  cancel?: Maybe<Scalars['Float']>;
  joined?: Maybe<Scalars['Float']>;
  timeSpend?: Maybe<Scalars['Float']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  fullname?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  banner?: Maybe<Scalars['String']>;
};


export type MutationFollowArgs = {
  receiver: Scalars['Float'];
  sender: Scalars['Float'];
};


export type MutationAcceptArgs = {
  receiver: Scalars['Float'];
  sender: Scalars['Float'];
};


export type MutationUnfollowArgs = {
  receiver: Scalars['Float'];
  sender: Scalars['Float'];
};


export type MutationSaveScheduleArgs = {
  company?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  members: Array<Scalars['Float']>;
  banner: Scalars['String'];
  startAt: Scalars['String'];
  dateType: Scalars['String'];
  title: Scalars['String'];
};


export type MutationDeleteScheduleArgs = {
  id: Scalars['Float'];
};


export type MutationUpdateScheduleArgs = {
  company?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  members: Array<Scalars['Float']>;
  banner: Scalars['String'];
  startAt: Scalars['String'];
  dateType: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationSaveDocumentArgs = {
  options: SaveDocumentInput;
};


export type MutationUpdateDocumentArgs = {
  options: UpdateDocumentInput;
};


export type MutationCreateNotificationArgs = {
  url: Scalars['String'];
  isSeen: Scalars['Boolean'];
  type: Scalars['String'];
  content: Scalars['String'];
  receiver: Scalars['Float'];
};


export type MutationSeenNotificationArgs = {
  id: Scalars['Float'];
};


export type MutationChatArgs = {
  options: MessageInput;
};


export type MutationUpdateMessageArgs = {
  context: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeleteMessageArgs = {
  id: Scalars['Float'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
  fullName: Scalars['String'];
};

export type SaveDocumentInput = {
  title: Scalars['String'];
  logo: Scalars['String'];
  record: Scalars['String'];
  scheduleId: Scalars['Float'];
  recordStartedAt: Scalars['Float'];
  startedAt: Scalars['String'];
  duration: Scalars['Float'];
  members: Array<Scalars['Float']>;
  absents: Array<Scalars['Float']>;
  transcripts: Array<TransInput>;
};

export type TransInput = {
  userId: Scalars['Float'];
  context: Scalars['String'];
  type: Scalars['String'];
  startedAt: Scalars['Float'];
};

export type UpdateDocumentInput = {
  id: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  startedAt?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Float']>;
  transcripts?: Maybe<TransUpdate>;
  company?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  scheduleId?: Maybe<Scalars['Float']>;
};

export type TransUpdate = {
  id: Scalars['Float'];
  context: Scalars['String'];
  isDelete?: Maybe<Scalars['Boolean']>;
};

export type MessageInput = {
  context: Scalars['String'];
  type: Scalars['String'];
  userId: Scalars['Float'];
  room: Scalars['String'];
};

export type DocumentFragmentFragment = (
  { __typename?: 'Document' }
  & Pick<Document, 'id' | 'title' | 'logo' | 'record' | 'recordStartedAt' | 'moreInfo' | 'startedAt' | 'duration' | 'members' | 'absents' | 'createdAt'>
  & { transcripts: Array<(
    { __typename?: 'Transcript' }
    & TranscriptFragmentFragment
  )>, schedule: (
    { __typename?: 'Schedule' }
    & ScheduleFragmentFragment
  ) }
);

export type ErrorFragmentFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type MessageFragmentFragment = (
  { __typename?: 'Message' }
  & Pick<Message, 'id' | 'context' | 'userId' | 'room' | 'type' | 'createdAt'>
  & { user: (
    { __typename?: 'User' }
    & UserFragmentFragment
  ) }
);

export type NotificationFragmentFragment = (
  { __typename?: 'Notification' }
  & Pick<Notification, 'id' | 'content' | 'receiver' | 'url' | 'type' | 'isSeen' | 'createdAt'>
  & { user: (
    { __typename?: 'User' }
    & UserFragmentFragment
  ) }
);

export type ScheduleFragmentFragment = (
  { __typename?: 'Schedule' }
  & Pick<Schedule, 'id' | 'title' | 'dateType' | 'startAt' | 'banner' | 'description' | 'company' | 'createdAt'>
  & { host: (
    { __typename?: 'User' }
    & UserFragmentFragment
  ) }
);

export type TranscriptFragmentFragment = (
  { __typename?: 'Transcript' }
  & Pick<Transcript, 'id' | 'context' | 'type' | 'userId' | 'startedAt' | 'createdAt'>
  & { user: (
    { __typename?: 'User' }
    & UserFragmentFragment
  ) }
);

export type UserFragmentFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'fullname' | 'email' | 'avatar' | 'banner' | 'timeSpend' | 'joined' | 'cancel' | 'document' | 'createdAt'>
);

export type UserInfoFragmentFragment = (
  { __typename?: 'UserInfo' }
  & Pick<UserInfo, 'id' | 'relationship'>
  & { user: (
    { __typename?: 'User' }
    & UserFragmentFragment
  ) }
);

export type UserResponseFragmentFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & ErrorFragmentFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export type AcceptMutationVariables = Exact<{
  sender: Scalars['Float'];
  receiver: Scalars['Float'];
}>;


export type AcceptMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'accept'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & UserResponseFragmentFragment
  ) }
);

export type ChatMutationVariables = Exact<{
  options: MessageInput;
}>;


export type ChatMutation = (
  { __typename?: 'Mutation' }
  & { chat: (
    { __typename?: 'Message' }
    & MessageFragmentFragment
  ) }
);

export type CreateMeetingMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateMeetingMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createMeeting'>
);

export type CreateNotificationMutationVariables = Exact<{
  receiver: Scalars['Float'];
  content: Scalars['String'];
  url: Scalars['String'];
  type: Scalars['String'];
  isSeen: Scalars['Boolean'];
}>;


export type CreateNotificationMutation = (
  { __typename?: 'Mutation' }
  & { createNotification?: Maybe<(
    { __typename?: 'Notification' }
    & NotificationFragmentFragment
  )> }
);

export type DeleteMessageMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteMessageMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteMessage'>
);

export type DeleteScheduleMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteScheduleMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteSchedule'>
);

export type EraseMeetingMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type EraseMeetingMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'eraseMeeting'>
);

export type FollowMutationVariables = Exact<{
  sender: Scalars['Float'];
  receiver: Scalars['Float'];
}>;


export type FollowMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'follow'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & UserResponseFragmentFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & UserResponseFragmentFragment
  ) }
);

export type SaveDocumentMutationVariables = Exact<{
  options: SaveDocumentInput;
}>;


export type SaveDocumentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'saveDocument'>
);

export type SaveScheduleMutationVariables = Exact<{
  title: Scalars['String'];
  dateType: Scalars['String'];
  startAt: Scalars['String'];
  banner: Scalars['String'];
  members: Array<Scalars['Float']> | Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
}>;


export type SaveScheduleMutation = (
  { __typename?: 'Mutation' }
  & { saveSchedule?: Maybe<(
    { __typename?: 'Schedule' }
    & ScheduleFragmentFragment
  )> }
);

export type SeenNotificationMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type SeenNotificationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'seenNotification'>
);

export type UnfollowMutationVariables = Exact<{
  sender: Scalars['Float'];
  receiver: Scalars['Float'];
}>;


export type UnfollowMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'unfollow'>
);

export type UpdateDocumentMutationVariables = Exact<{
  options: UpdateDocumentInput;
}>;


export type UpdateDocumentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateDocument'>
);

export type UpdateInfoMutationVariables = Exact<{
  banner?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  fullname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  joined?: Maybe<Scalars['Float']>;
  cancel?: Maybe<Scalars['Float']>;
  document?: Maybe<Scalars['Float']>;
  timeSpend?: Maybe<Scalars['Float']>;
}>;


export type UpdateInfoMutation = (
  { __typename?: 'Mutation' }
  & { updateInfo?: Maybe<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export type UpdateMessageMutationVariables = Exact<{
  id: Scalars['Float'];
  context: Scalars['String'];
}>;


export type UpdateMessageMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateMessage'>
);

export type UpdateScheduleMutationVariables = Exact<{
  id: Scalars['Float'];
  title: Scalars['String'];
  dateType: Scalars['String'];
  startAt: Scalars['String'];
  banner: Scalars['String'];
  members: Array<Scalars['Float']> | Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
}>;


export type UpdateScheduleMutation = (
  { __typename?: 'Mutation' }
  & { updateSchedule: (
    { __typename?: 'Schedule' }
    & ScheduleFragmentFragment
  ) }
);

export type DocumentQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DocumentQuery = (
  { __typename?: 'Query' }
  & { document?: Maybe<(
    { __typename?: 'DocumentValue' }
    & Pick<DocumentValue, 'isabsent'>
    & { document: (
      { __typename?: 'Document' }
      & DocumentFragmentFragment
    ), users: Array<(
      { __typename?: 'User' }
      & UserFragmentFragment
    )> }
  )> }
);

export type DocumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type DocumentsQuery = (
  { __typename?: 'Query' }
  & { documents?: Maybe<Array<(
    { __typename?: 'Document' }
    & DocumentFragmentFragment
  )>> }
);

export type GetScheduleQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type GetScheduleQuery = (
  { __typename?: 'Query' }
  & { getSchedule?: Maybe<(
    { __typename?: 'ScheduleValue' }
    & { schedule: (
      { __typename?: 'Schedule' }
      & ScheduleFragmentFragment
    ), users: Array<(
      { __typename?: 'User' }
      & UserFragmentFragment
    )> }
  )> }
);

export type GetSchedulesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSchedulesQuery = (
  { __typename?: 'Query' }
  & { getSchedules: Array<(
    { __typename?: 'Schedule' }
    & ScheduleFragmentFragment
  )> }
);

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type GetUserByIdQuery = (
  { __typename?: 'Query' }
  & { getUserById?: Maybe<(
    { __typename?: 'UserInfo' }
    & UserInfoFragmentFragment
  )> }
);

export type GetUserDocumentQueryVariables = Exact<{
  options: GetUserDocumentInput;
}>;


export type GetUserDocumentQuery = (
  { __typename?: 'Query' }
  & { getUserDocument: Array<(
    { __typename?: 'UserDocumentInfo' }
    & Pick<UserDocumentInfo, 'isAbsent'>
    & { user: (
      { __typename?: 'User' }
      & UserFragmentFragment
    ) }
  )> }
);

export type GetUserFromScheduleQueryVariables = Exact<{
  scheduleId: Scalars['Float'];
}>;


export type GetUserFromScheduleQuery = (
  { __typename?: 'Query' }
  & { getUserFromSchedule: Array<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export type MessagesQueryVariables = Exact<{
  room: Scalars['String'];
}>;


export type MessagesQuery = (
  { __typename?: 'Query' }
  & { messages?: Maybe<Array<(
    { __typename?: 'Message' }
    & MessageFragmentFragment
  )>> }
);

export type NotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsQuery = (
  { __typename?: 'Query' }
  & { notifications?: Maybe<Array<(
    { __typename?: 'Notification' }
    & NotificationFragmentFragment
  )>> }
);

export type RelationshipsQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type RelationshipsQuery = (
  { __typename?: 'Query' }
  & { relationships: Array<(
    { __typename?: 'UserInfo' }
    & UserInfoFragmentFragment
  )> }
);

export type SearchUserQueryVariables = Exact<{
  search: Scalars['String'];
  friend?: Maybe<Scalars['Boolean']>;
}>;


export type SearchUserQuery = (
  { __typename?: 'Query' }
  & { searchUser: Array<(
    { __typename?: 'UserInfo' }
    & UserInfoFragmentFragment
  )> }
);

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  username
  fullname
  email
  avatar
  banner
  timeSpend
  joined
  cancel
  document
  createdAt
}
    `;
export const TranscriptFragmentFragmentDoc = gql`
    fragment TranscriptFragment on Transcript {
  id
  context
  type
  userId
  user {
    ...UserFragment
  }
  startedAt
  createdAt
}
    ${UserFragmentFragmentDoc}`;
export const ScheduleFragmentFragmentDoc = gql`
    fragment ScheduleFragment on Schedule {
  id
  title
  dateType
  startAt
  banner
  host {
    ...UserFragment
  }
  description
  company
  createdAt
}
    ${UserFragmentFragmentDoc}`;
export const DocumentFragmentFragmentDoc = gql`
    fragment DocumentFragment on Document {
  id
  title
  logo
  record
  recordStartedAt
  moreInfo
  startedAt
  duration
  transcripts {
    ...TranscriptFragment
  }
  members
  absents
  schedule {
    ...ScheduleFragment
  }
  createdAt
}
    ${TranscriptFragmentFragmentDoc}
${ScheduleFragmentFragmentDoc}`;
export const MessageFragmentFragmentDoc = gql`
    fragment MessageFragment on Message {
  id
  context
  userId
  user {
    ...UserFragment
  }
  room
  type
  createdAt
}
    ${UserFragmentFragmentDoc}`;
export const NotificationFragmentFragmentDoc = gql`
    fragment NotificationFragment on Notification {
  id
  content
  receiver
  url
  user {
    ...UserFragment
  }
  type
  isSeen
  createdAt
}
    ${UserFragmentFragmentDoc}`;
export const UserInfoFragmentFragmentDoc = gql`
    fragment UserInfoFragment on UserInfo {
  id
  user {
    ...UserFragment
  }
  relationship
}
    ${UserFragmentFragmentDoc}`;
export const ErrorFragmentFragmentDoc = gql`
    fragment ErrorFragment on FieldError {
  field
  message
}
    `;
export const UserResponseFragmentFragmentDoc = gql`
    fragment UserResponseFragment on UserResponse {
  errors {
    ...ErrorFragment
  }
  user {
    ...UserFragment
  }
}
    ${ErrorFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;
export const AcceptDocument = gql`
    mutation Accept($sender: Float!, $receiver: Float!) {
  accept(sender: $sender, receiver: $receiver)
}
    `;

export function useAcceptMutation() {
  return Urql.useMutation<AcceptMutation, AcceptMutationVariables>(AcceptDocument);
};
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...UserResponseFragment
  }
}
    ${UserResponseFragmentFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ChatDocument = gql`
    mutation Chat($options: MessageInput!) {
  chat(options: $options) {
    ...MessageFragment
  }
}
    ${MessageFragmentFragmentDoc}`;

export function useChatMutation() {
  return Urql.useMutation<ChatMutation, ChatMutationVariables>(ChatDocument);
};
export const CreateMeetingDocument = gql`
    mutation CreateMeeting {
  createMeeting
}
    `;

export function useCreateMeetingMutation() {
  return Urql.useMutation<CreateMeetingMutation, CreateMeetingMutationVariables>(CreateMeetingDocument);
};
export const CreateNotificationDocument = gql`
    mutation CreateNotification($receiver: Float!, $content: String!, $url: String!, $type: String!, $isSeen: Boolean!) {
  createNotification(
    receiver: $receiver
    content: $content
    url: $url
    type: $type
    isSeen: $isSeen
  ) {
    ...NotificationFragment
  }
}
    ${NotificationFragmentFragmentDoc}`;

export function useCreateNotificationMutation() {
  return Urql.useMutation<CreateNotificationMutation, CreateNotificationMutationVariables>(CreateNotificationDocument);
};
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($id: Float!) {
  deleteMessage(id: $id)
}
    `;

export function useDeleteMessageMutation() {
  return Urql.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument);
};
export const DeleteScheduleDocument = gql`
    mutation DeleteSchedule($id: Float!) {
  deleteSchedule(id: $id)
}
    `;

export function useDeleteScheduleMutation() {
  return Urql.useMutation<DeleteScheduleMutation, DeleteScheduleMutationVariables>(DeleteScheduleDocument);
};
export const EraseMeetingDocument = gql`
    mutation EraseMeeting($code: String!) {
  eraseMeeting(code: $code)
}
    `;

export function useEraseMeetingMutation() {
  return Urql.useMutation<EraseMeetingMutation, EraseMeetingMutationVariables>(EraseMeetingDocument);
};
export const FollowDocument = gql`
    mutation Follow($sender: Float!, $receiver: Float!) {
  follow(sender: $sender, receiver: $receiver)
}
    `;

export function useFollowMutation() {
  return Urql.useMutation<FollowMutation, FollowMutationVariables>(FollowDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...UserResponseFragment
  }
}
    ${UserResponseFragmentFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...UserResponseFragment
  }
}
    ${UserResponseFragmentFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const SaveDocumentDocument = gql`
    mutation SaveDocument($options: SaveDocumentInput!) {
  saveDocument(options: $options)
}
    `;

export function useSaveDocumentMutation() {
  return Urql.useMutation<SaveDocumentMutation, SaveDocumentMutationVariables>(SaveDocumentDocument);
};
export const SaveScheduleDocument = gql`
    mutation SaveSchedule($title: String!, $dateType: String!, $startAt: String!, $banner: String!, $members: [Float!]!, $description: String, $company: String) {
  saveSchedule(
    title: $title
    dateType: $dateType
    startAt: $startAt
    banner: $banner
    members: $members
    description: $description
    company: $company
  ) {
    ...ScheduleFragment
  }
}
    ${ScheduleFragmentFragmentDoc}`;

export function useSaveScheduleMutation() {
  return Urql.useMutation<SaveScheduleMutation, SaveScheduleMutationVariables>(SaveScheduleDocument);
};
export const SeenNotificationDocument = gql`
    mutation SeenNotification($id: Float!) {
  seenNotification(id: $id)
}
    `;

export function useSeenNotificationMutation() {
  return Urql.useMutation<SeenNotificationMutation, SeenNotificationMutationVariables>(SeenNotificationDocument);
};
export const UnfollowDocument = gql`
    mutation Unfollow($sender: Float!, $receiver: Float!) {
  unfollow(sender: $sender, receiver: $receiver)
}
    `;

export function useUnfollowMutation() {
  return Urql.useMutation<UnfollowMutation, UnfollowMutationVariables>(UnfollowDocument);
};
export const UpdateDocumentDocument = gql`
    mutation UpdateDocument($options: UpdateDocumentInput!) {
  updateDocument(options: $options)
}
    `;

export function useUpdateDocumentMutation() {
  return Urql.useMutation<UpdateDocumentMutation, UpdateDocumentMutationVariables>(UpdateDocumentDocument);
};
export const UpdateInfoDocument = gql`
    mutation UpdateInfo($banner: String, $avatar: String, $fullname: String, $email: String, $username: String, $joined: Float, $cancel: Float, $document: Float, $timeSpend: Float) {
  updateInfo(
    banner: $banner
    avatar: $avatar
    fullname: $fullname
    email: $email
    username: $username
    joined: $joined
    cancel: $cancel
    document: $document
    timeSpend: $timeSpend
  ) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

export function useUpdateInfoMutation() {
  return Urql.useMutation<UpdateInfoMutation, UpdateInfoMutationVariables>(UpdateInfoDocument);
};
export const UpdateMessageDocument = gql`
    mutation updateMessage($id: Float!, $context: String!) {
  updateMessage(id: $id, context: $context)
}
    `;

export function useUpdateMessageMutation() {
  return Urql.useMutation<UpdateMessageMutation, UpdateMessageMutationVariables>(UpdateMessageDocument);
};
export const UpdateScheduleDocument = gql`
    mutation UpdateSchedule($id: Float!, $title: String!, $dateType: String!, $startAt: String!, $banner: String!, $members: [Float!]!, $description: String, $company: String) {
  updateSchedule(
    id: $id
    title: $title
    dateType: $dateType
    startAt: $startAt
    banner: $banner
    members: $members
    description: $description
    company: $company
  ) {
    ...ScheduleFragment
  }
}
    ${ScheduleFragmentFragmentDoc}`;

export function useUpdateScheduleMutation() {
  return Urql.useMutation<UpdateScheduleMutation, UpdateScheduleMutationVariables>(UpdateScheduleDocument);
};
export const DocumentDocument = gql`
    query Document($id: Float!) {
  document(id: $id) {
    document {
      ...DocumentFragment
    }
    users {
      ...UserFragment
    }
    isabsent
  }
}
    ${DocumentFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;

export function useDocumentQuery(options: Omit<Urql.UseQueryArgs<DocumentQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<DocumentQuery>({ query: DocumentDocument, ...options });
};
export const DocumentsDocument = gql`
    query Documents {
  documents {
    ...DocumentFragment
  }
}
    ${DocumentFragmentFragmentDoc}`;

export function useDocumentsQuery(options: Omit<Urql.UseQueryArgs<DocumentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<DocumentsQuery>({ query: DocumentsDocument, ...options });
};
export const GetScheduleDocument = gql`
    query GetSchedule($id: Float!) {
  getSchedule(id: $id) {
    schedule {
      ...ScheduleFragment
    }
    users {
      ...UserFragment
    }
  }
}
    ${ScheduleFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;

export function useGetScheduleQuery(options: Omit<Urql.UseQueryArgs<GetScheduleQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetScheduleQuery>({ query: GetScheduleDocument, ...options });
};
export const GetSchedulesDocument = gql`
    query GetSchedules {
  getSchedules {
    ...ScheduleFragment
  }
}
    ${ScheduleFragmentFragmentDoc}`;

export function useGetSchedulesQuery(options: Omit<Urql.UseQueryArgs<GetSchedulesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSchedulesQuery>({ query: GetSchedulesDocument, ...options });
};
export const GetUserByIdDocument = gql`
    query GetUserById($id: Float!) {
  getUserById(id: $id) {
    ...UserInfoFragment
  }
}
    ${UserInfoFragmentFragmentDoc}`;

export function useGetUserByIdQuery(options: Omit<Urql.UseQueryArgs<GetUserByIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserByIdQuery>({ query: GetUserByIdDocument, ...options });
};
export const GetUserDocumentDocument = gql`
    query GetUserDocument($options: GetUserDocumentInput!) {
  getUserDocument(options: $options) {
    isAbsent
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useGetUserDocumentQuery(options: Omit<Urql.UseQueryArgs<GetUserDocumentQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserDocumentQuery>({ query: GetUserDocumentDocument, ...options });
};
export const GetUserFromScheduleDocument = gql`
    query GetUserFromSchedule($scheduleId: Float!) {
  getUserFromSchedule(scheduleId: $scheduleId) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

export function useGetUserFromScheduleQuery(options: Omit<Urql.UseQueryArgs<GetUserFromScheduleQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserFromScheduleQuery>({ query: GetUserFromScheduleDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const MessagesDocument = gql`
    query Messages($room: String!) {
  messages(room: $room) {
    ...MessageFragment
  }
}
    ${MessageFragmentFragmentDoc}`;

export function useMessagesQuery(options: Omit<Urql.UseQueryArgs<MessagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MessagesQuery>({ query: MessagesDocument, ...options });
};
export const NotificationsDocument = gql`
    query Notifications {
  notifications {
    ...NotificationFragment
  }
}
    ${NotificationFragmentFragmentDoc}`;

export function useNotificationsQuery(options: Omit<Urql.UseQueryArgs<NotificationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NotificationsQuery>({ query: NotificationsDocument, ...options });
};
export const RelationshipsDocument = gql`
    query Relationships($id: Float!) {
  relationships(id: $id) {
    ...UserInfoFragment
  }
}
    ${UserInfoFragmentFragmentDoc}`;

export function useRelationshipsQuery(options: Omit<Urql.UseQueryArgs<RelationshipsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RelationshipsQuery>({ query: RelationshipsDocument, ...options });
};
export const SearchUserDocument = gql`
    query SearchUser($search: String!, $friend: Boolean) {
  searchUser(search: $search, friend: $friend) {
    ...UserInfoFragment
  }
}
    ${UserInfoFragmentFragmentDoc}`;

export function useSearchUserQuery(options: Omit<Urql.UseQueryArgs<SearchUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchUserQuery>({ query: SearchUserDocument, ...options });
};