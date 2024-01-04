interface IProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  imageUrl: string;
  servers: IServer[];
  members: IMember[];
  channels: IChannel[];
  createdAt: Date;
  updatedAt: Date;
}

interface IServer {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
  profile: IProfile;
  members: IMember[];
  channels: IChannel[];
  createdAt: Date;
  updatedAt: Date;
}

enum MemberRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}

interface IMember {
  id: string;
  role: MemberRole;
  profileId: string;
  profile: IProfile;
  serverId: string;
  server: IServer;
  createdAt: Date;
  updatedAt: Date;
}

enum ChannelType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

interface IChannel {
  id: string;
  name: string;
  type: ChannelType;
  profileId: string;
  profile: IProfile;
  serverId: string;
  server: IServer;
  createdAt: Date;
  updatedAt: Date;
}

export type { IProfile, IServer, IMember, IChannel, MemberRole, ChannelType };
