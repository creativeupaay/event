export enum GenderEnum{
    MALE="MALE",
    FEMALE="FEMALE",
    OTHER="OTHER"
}

export enum RequestStatusEnum{
    PENDING="PENDING",
    ACCEPTED="ACCEPTED",
    REJECTED="REJECTED",
}

export enum OrganizationEnum {
    COMPANY = "COMPANY",
    EDUCATION = "EDUCATION",
    INDIVIDUAL = "INDIVIDUAL"
}

export enum AccountStatusEnum {
    ACTIVE = 'ACTIVE',                                      // Account is active and fully operational.
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',          // Account is awaiting email verification or admin approval.
    SUSPENDED = 'SUSPENDED',                                // Account is temporarily suspended (e.g., due to policy violations).
    CLOSED = 'CLOSED',                                      // Account has been closed (voluntary or due to violation).
    BANNED = 'BANNED',                                      // Account has been permanently banned (e.g., for illegal activities).
    INACTIVE = 'INACTIVE',                                  // Account is inactive, often due to a long period of no activity.
    LOCKED = 'LOCKED',                                      // Account is temporarily locked due to security concerns (e.g., failed logins).
    EXPIRED = 'EXPIRED',                                    // Account or subscription has expired (e.g., subscription ended).
}

export enum NotificationEnum {
    FRIEND_REQUEST_RECEIVED = 'friend_request_received',
    FRIEND_REQUEST_ACCEPTED = 'friend_request_accepted',
    FRIEND_ADDED_DIRECTLY = 'friend_added_directly',
    POST_LIKED = 'post_liked', 
    COMMENT_RECEIVED = 'comment_received',
  }
  