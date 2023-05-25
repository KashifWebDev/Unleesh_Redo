//CurrentPath
export interface currentPathInterface {
  id: number,
  name: string
}

//dashboard/paths/default
export interface userPaths{
  status: string,
  statusCode: number,
  paths: paths[]
}
export interface paths{
  id: number,
  name: string,
  totalPoints: number,
  overallPoints: number,
  status: string,
  shown: boolean,
  icon: string
}

///dashboard/paths/default
export interface currentPath{
  status: string,
  statusCode: number,
  path: currentPathChild
}
export interface currentPathChild{
  id: number,
  title: string,
  totalPoints: number,
  overallPoints: number,
  icon: string,
  isPaid: boolean,
  length: number,
  isStarted: boolean,
  hasInvite: boolean,
  pathRole: string,
  description: string,
  price: number,
  emailNotifications: boolean,
  pushNotifications: boolean,
  pathTags?: {}
}

//dashboard/paths/view/:id
export interface pathDetail{
  status: string,
  statusCode: number,
  path: currentPathChild
}
export interface pathView{
  status: string,
  statusCode: number,
  phases: pathViewContent[]
}
export interface pathViewContent{
  id: number,
  phaseNumber: number,
  phaseName: string,
  actionPoints: {},
  phasePoints: number,
  levels: {
    id: number,
    levelNumber: number,
    targetPoints: number,
    levelPoints: number,
    actions: pathViewContentDetails[]
  }[]
}
export interface pathViewContentDetails {
  id: number,
  title: number,
  description: string,
  actionSubmitDescription: string,
  actionNumber: number,
  actionSubmitCount: number,
  submitOptions: {
    type: string,
    list: {
      allowText: boolean,
      allowPhoto: boolean,
      allowAudio: boolean,
      allowVideo: boolean,
      allowDocument: boolean,
      label: string
    }[],

  },
  points: number,
  completed: boolean,
  completedOnce: boolean,
  attachment: any,
  attachmentType: any,
  actionSubmit: any,
  videoRoomData: any,
  zoomSignature: string,
  zoomMeetingId: number,
  zoomMeetingPwd: string,
  dropBoxData: any
}

// App Right Feed Bar
export interface rightBar{
  status: string,
  statusCode: number,
  currentPage: number,
  pagesNum: number,
  timestamp: number,
  feeds: rightBarFeeds[]
}
export interface rightBarFeeds {
  activity: {
    id: number,
    title: string,
    address: string,
    icon: string,
    description: string,
    latitude: any,
    longitude: any,
    host: rightBarUserDetails,
    expired: boolean,
    startDate: string,
    endDate: string,
    created: string,
    modified: string,
    hmcAudio: string,
    comment? : string
    message?: string
    attachmentType?: string
    attachment?: string,
    actionSubmit?: {
      id: number,
      attachmentType: string,
      originalName: string,
      is_private: boolean,
      created: string,
      action: {
        id: number,
        title: string,
        actionNumber: number,
        points: number
      },
      posts: discussionReply[]
    },
    posts?: pathViewContentAddCommentContent[],
    action: {
      actionSubmitCount: number,
      id: number,
      title: string,
      description: string,
      actionNumber: number,
      points: number,
      attachment: any,
      attachmentType: any,
      actionSubmitDescription: string
    },
    user?: rightBarUserDetails
  },
  id: number,
  created: string,
  message: string,
  parentEntryTitle: any,
  activityType: string,
  user: rightBarUserDetails,
  activityLinkTitle: string,
  activityLink: string,
  show?: boolean
}
export interface rightBarUserDetails{
    id: number,
    email: string,
    firstName: any,
    lastName: any,
    birthdate: any,
    unsubscribed: false,
    zip: any,
    state: any,
    city: any,
    company: any,
    profession: any,
    education: any,
    photo: any,
    quote: any,
    totalPoints: any,
    appreciationPoints: any,
    submitCommentAppreciationPoints: 0,
    twitter_uid: any,
    gplus_uid: any,
    pathRole: string,
    token? : string
}

///pathmates
export interface getPathMates{
  status: string,
  statusCode: number,
  users: pathMatesUsersList[]
}
export interface pathMatesUsersList{
  id: number,
  firstName: string,
  lastName: string,
  company: string,
  profession: string,
  education: string,
  photo: string,
  currentPath: any,
  isFavoriteUser: boolean,
  totalPoints: number,
  lastUserAction?: {
    id: number,
    attachmentType: string,
    originalName: string,
    is_private: boolean,
    created: string,
    action: {
      id: number,
      title: string,
      actionNumber: number,
      points: number
    }
  }
}

//User Profile
export interface userProfile{
  status: string,
  statusCode: number,
  user: userProfileContent
}
export interface userProfileContent {
  id: number,
  firstName: string,
  lastName: string,
  unsubscribed: false,
  company: any,
  profession: any,
  education: any,
  photo: string,
  quote: any,
  isFavoriteUser: false,
  totalPoints: number,
  twitter_uid: any,
  gplus_uid: any
}

//Discussions List
export interface discussions{
  status: string,
  statusCode: number,
  currentPage: number,
  pagesNum: number,
  posts: discussionContent[]
}
export interface discussionContent {
  id: number,
  message: string,
  created: string,
  updatedDate: string,
  attachment: any,
  attachmentType: any,
  replies: discussionReply[],
  user: rightBarUserDetails,
  showReply: boolean
}
export interface discussionReply {
  appreciations: number,
  isAlreadyAppreciated: false,
  id: number,
  message: string,
  created: string,
  attachment: any,
  attachmentType: any,
  user: rightBarUserDetails,
  replies? : any
}

// Login & Edit user Profile
export interface login{
  status: string,
  statusCode: number,
  user: rightBarUserDetails
}

// Path View Content Add Comment
export interface pathViewContentAddComment {
  status: string,
  statusCode: number,
  actionSubmit: pathViewContentAddCommentContent
}
export interface pathViewContentAddCommentContent {
  id: number,
  attachment: string,
  attachmentType: string,
  originalName: string,
  is_private: boolean,
  created: string,
  submit_email: any,
  user: rightBarUserDetails,
  action: pathViewContentDetails,
  posts: [],
  comment: string,
  changed: string,
  message?: string
}

// Path Activity Content Comment
export interface pathContentComment {
  status: string,
  statusCode: number,
  currentPage: string,
  pagesNum: number,
  timestamp: number
  feeds?: pathContentCommentContent[],
  posts?: discussionReply[],
}
export interface pathContentCommentContent {
  activity: pathViewContentAddCommentContent,
  id: number,
  created: string,
  message?: string,
  parentEntryTitle: any,
  activityType: string,
  user: rightBarUserDetails,
  activityLinkTitle: string,
  activityLink: string
  showReply: boolean
}

// ALl Threads
export interface allPathMails {
  status: string,
  statusCode: number,
  threads: allPathMailsContent[]
  search: any
}
export interface thread {
  status: string,
  statusCode: number,
  pathmailMessages: threadDetails[]
}
export interface pathMailParticipants {
  firstName: string,
  lastName: string
}
export interface pathMailMessage {
  isRead: boolean,
  id: number,
  message: string,
  created: string,
  author: pathMailAuthor
}
export interface pathMailAuthor {
  id: number,
  firstName: string,
  lastName: string,
  photo: string,
}
export interface pathMailPaths {
  title: string
}
export interface allPathMailsContent {
  participants: pathMailParticipants[],
  toAll: boolean,
  paths: pathMailPaths[],
  id: number,
  messages: pathMailMessage[]
}
export interface createPathMail {
  status: string,
  statusCode: number,
  users: pathMailUsers[]
  paths?: pathMailPaths[]
}
export interface pathMailUsers {
  id: number,
  firstName: string,
  lastName: string,
  currentPath?: any
}
export interface pathMailPaths {
  id: number,
  title: string
}
export interface threadDetails {
  isRead: any,
  id: number,
  message: string,
  created: string,
  author: pathMailAuthor,
  attachment: any,
  attachmentType: string,
  eventId: any
}


//BreakOut
export interface breakouts {
  status: string,
  statusCode: number,
  events: allBreakouts[]
}
export interface allBreakouts {
  status: any,
  path: {
    id: number,
    title: string,
    icon: string
  },
  id: number,
  title: string,
  address: string,
  icon: string,
  description: string,
  host: {
    id: number,
    firstName: string,
    lastName: string,
    photo: string,
  },
  expired: string,
  startDate: string,
  endDate: string,
}
export interface singleBreakout{
  status: string,
  statusCode: number,
  event: {
    status: number,
    invitedCount: number,
    goingCount: number,
    cantCount: number,
    path: {
      id: number,
      title: string,
      icon: string
    },
    id: number,
    title: string,
    address: string,
    icon: string,
    description: string,
    latitude: string,
    longitude: string,
    host: {
      id: number,
      firstName: string,
      lastName: string,
      photo: string,
        totalPoints: any
    },
    expired: boolean,
    startDate: string,
    endDate: string,
    created: string,
    modified: string,
    hmcAudio: any
  }
}
export interface breakoutUserStatus {
  status: string,
  statusCode: number,
  users: {
    status: number,
    user: {
      firstName: string,
      id: number,
      lastName: string,
      photo: string
    }
  }[]
}
