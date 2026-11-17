"use client";

import Post from "@/app/_components/Post/Post";
import ProfilePhoto from "@/app/_components/ProfilePhoto/ProfilePhoto";
import useUserInfo from "@/lib/useUserPosts";
import { getUserBookmarks } from "@/lib/postSlice";
import {
  getUserData,
  getUserProfileById,
  toggleFollowUser,
} from "@/lib/profileSlice";
import { dispatchType, stateType } from "@/lib/store";
import {
  ArrowBackRounded,
  ArticleOutlined,
  BookmarkBorderOutlined,
  CalendarMonthOutlined,
  CheckRounded,
  ErrorOutlineRounded,
  EmailOutlined,
  GroupsOutlined,
  HomeRounded,
  PersonAddAlt1Outlined,
  PersonOutline,
  RefreshRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [tab, setTab] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { posts, loading, error, refetch } = useUserInfo(id);

  const {
    userData,
    isLoading: profileLoading,
    error: accountError,
    viewedUser,
    viewedUserIsFollowing,
    viewedUserLoading,
    viewedUserError,
    followActionUserIds,
  } = useSelector((state: stateType) => state.profile);

  const { savedPosts, savedPostsLoading, savedPostsError } = useSelector(
    (state: stateType) => state.post,
  );

  const dispatch = useDispatch<dispatchType>();
  const router = useRouter();
  const isOwnProfile = currentUserId === id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ user?: string }>(token);
        setCurrentUserId(decoded.user ?? null);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUserId) dispatch(getUserData());
  }, [currentUserId, dispatch]);

  useEffect(() => {
    if (id && currentUserId && id !== currentUserId) {
      dispatch(getUserProfileById(id));
    }
  }, [id, currentUserId, dispatch]);

  useEffect(() => {
    setTab(0);
  }, [id]);

  useEffect(() => {
    if (tab === 1 && isOwnProfile) {
      dispatch(getUserBookmarks({ page: 1, limit: 20 }));
    }
  }, [tab, isOwnProfile, dispatch]);

  const profileData = isOwnProfile ? userData : viewedUser;
  const isProfileLoading = isOwnProfile
    ? profileLoading && !userData._id
    : viewedUserLoading || (!viewedUser && !viewedUserError);
  const profile = profileData ?? userData;
  const profileError = error || (isOwnProfile ? accountError : viewedUserError);

  function retryProfileLoad() {
    refetch();
    if (isOwnProfile) dispatch(getUserData());
    else dispatch(getUserProfileById(id));
  }

  async function handleFollowToggle() {
    try {
      const result = await dispatch(toggleFollowUser({ userId: id })).unwrap();
      toast.success(
        result.following
          ? `Following ${profile.name}`
          : `Unfollowed ${profile.name}`,
      );
    } catch (followError) {
      toast.error(
        followError instanceof Error
          ? followError.message
          : "Could not update follow status",
      );
    }
  }

  if (loading || !currentUserId || isProfileLoading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 60px)",
          bgcolor: "var(--app-bg)",
          py: { xs: 2, md: 3 },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ px: { xs: 1.5, sm: 2.5 } }}
          aria-label="Loading profile"
        >
          <Skeleton
            variant="rounded"
            animation="wave"
            height={isOwnProfile ? 170 : 210}
            sx={{
              borderRadius: "24px 24px 0 0",
              bgcolor: "var(--surface-muted)",
            }}
          />
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              mt: -5,
              mx: { xs: 1, sm: 2 },
              p: { xs: 2, sm: 3 },
              border: "1px solid var(--border)",
              borderRadius: "20px",
              bgcolor: "var(--surface)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton
                variant="circular"
                animation="wave"
                width={88}
                height={88}
                sx={{ bgcolor: "var(--surface-muted)" }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  animation="wave"
                  width="42%"
                  height={34}
                  sx={{ bgcolor: "var(--surface-muted)" }}
                />
                <Skeleton
                  animation="wave"
                  width="28%"
                  height={24}
                  sx={{ bgcolor: "var(--surface-muted)" }}
                />
              </Box>
              <Skeleton
                variant="rounded"
                animation="wave"
                width={112}
                height={42}
                sx={{
                  display: { xs: "none", sm: "block" },
                  borderRadius: 3,
                  bgcolor: "var(--surface-muted)",
                }}
              />
            </Box>
          </Paper>
          <Box sx={{ mt: 2, display: "grid", gap: 1.5 }}>
            {[0, 1].map((item) => (
              <Paper
                key={item}
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid var(--border)",
                  borderRadius: "18px",
                  bgcolor: "var(--surface)",
                }}
              >
                <Skeleton
                  animation="wave"
                  height={24}
                  width="22%"
                  sx={{ bgcolor: "var(--surface-muted)" }}
                />
                <Skeleton
                  animation="wave"
                  height={18}
                  width="60%"
                  sx={{ bgcolor: "var(--surface-muted)" }}
                />
                <Skeleton
                  animation="wave"
                  height={18}
                  width="44%"
                  sx={{ bgcolor: "var(--surface-muted)" }}
                />
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  if (profileError) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 60px)",
          display: "grid",
          placeItems: "center",
          bgcolor: "var(--app-bg)",
          px: 2,
          py: 5,
        }}
      >
        <Paper
          elevation={0}
          role="alert"
          sx={{
            width: "100%",
            maxWidth: 480,
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            border: "1px solid var(--border)",
            borderRadius: "22px",
            bgcolor: "var(--surface)",
            boxShadow: "0 8px 24px rgb(24 34 55 / 0.07)",
          }}
        >
          <Box
            sx={{
              width: 58,
              height: 58,
              mx: "auto",
              mb: 2,
              display: "grid",
              placeItems: "center",
              borderRadius: "18px",
              bgcolor: "var(--danger-soft)",
              color: "var(--danger-text)",
            }}
          >
            <ErrorOutlineRounded sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            component="h1"
            sx={{
              color: "var(--text-primary)",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            We couldn’t load this profile
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              color: "var(--text-muted)",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {profileError}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 1,
              mt: 2.5,
            }}
          >
            <Button
              variant="contained"
              startIcon={<RefreshRounded />}
              onClick={retryProfileLoad}
              sx={{
                borderRadius: "12px",
                px: 2,
                py: 1,
                fontWeight: 750,
                textTransform: "none",
                boxShadow: "none",
                bgcolor: "var(--accent-strong)",
                color: "#ffffff",
                "&:hover": {
                  bgcolor: "var(--accent-border)",
                  boxShadow: "none",
                },
                "html[data-theme='dark'] &": {
                  color: "#172033",
                },
              }}
            >
              Try again
            </Button>
            <Button
              startIcon={<HomeRounded />}
              onClick={() => router.push("/feed")}
              sx={{
                borderRadius: "12px",
                px: 2,
                py: 1,
                color: "var(--text-secondary)",
                fontWeight: 750,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "var(--surface-hover)",
                },
              }}
            >
              Back to feed
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  const username = profile.username
    ? `@${profile.username.replace(/^@/, "")}`
    : `@${(profile.name || "member").toLowerCase().replace(/\s+/g, "_")}`;

  const savedCount =
    profile.bookmarksCount ??
    profile.bookmarks?.length ??
    (isOwnProfile ? savedPosts?.length : undefined) ??
    0;

  const stats = [
    {
      label: "Followers",
      value: profile.followersCount ?? profile.followers?.length ?? 0,
      icon: <GroupsOutlined />,
    },
    {
      label: "Following",
      value: profile.followingCount ?? profile.following?.length ?? 0,
      icon: <PersonOutline />,
    },
    {
      label: "Saved posts",
      value: savedCount,
      icon: <BookmarkBorderOutlined />,
    },
  ];

  const aboutItems = [
    {
      label: "Email",
      value: isOwnProfile ? profile.email : "",
      icon: <EmailOutlined />,
    },
    {
      label: "Member since",
      value: profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })
        : "VibeHub member",
      icon: <CalendarMonthOutlined />,
    },
  ].filter((item) => item.value);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 52px)",
        bgcolor: "var(--app-bg)",
        py: { xs: 1.25, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2.5 } }}>
        {!isOwnProfile && (
          <Button
            startIcon={<ArrowBackRounded />}
            onClick={() => router.push("/feed")}
            sx={{
              mb: 1.5,
              minHeight: 38,
              px: 1.75,
              border: "1px solid var(--border)",
              borderRadius: "13px",
              bgcolor: "var(--surface)",
              color: "var(--text-secondary)",
              fontWeight: 750,
              textTransform: "none",
              "&:hover": {
                bgcolor: "var(--surface-subtle)",
                borderColor: "var(--border-strong)",
              },
            }}
          >
            Back to feed
          </Button>
        )}

        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            border: "1px solid var(--border)",
            borderRadius: { xs: "20px", md: "26px" },
            bgcolor: "var(--surface)",
            boxShadow: "0 8px 24px rgb(24 34 55 / 0.07)",
          }}
        >
          <Box
            sx={{
              height: isOwnProfile
                ? { xs: 112, sm: 170, md: 205 }
                : { xs: 100, sm: 145, md: 175 },
              position: "relative",
              overflow: "hidden",
              background: profile.cover
                ? `linear-gradient(90deg, rgb(17 34 55 / 0.62), rgb(17 34 55 / 0.08)), url("${profile.cover}") center / cover no-repeat`
                : "radial-gradient(ellipse at 82% 24%, rgb(141 197 239 / 0.75), transparent 35%), linear-gradient(112deg, #172235 0%, #244c72 54%, #5b91b8 100%)",
              "&::after": {
                content: '""',
                position: "absolute",
                width: 280,
                height: 280,
                right: { xs: -100, md: 80 },
                top: -155,
                border: "1px solid rgb(255 255 255 / 0.15)",
                borderRadius: "50%",
                boxShadow:
                  "0 0 0 34px rgb(255 255 255 / 0.035), 0 0 0 70px rgb(255 255 255 / 0.025)",
              },
            }}
          />

          <Box
            sx={{
              px: { xs: 1.25, sm: 3, md: 4 },
              pb: isOwnProfile ? { xs: 2.5, md: 4 } : { xs: 2, md: 2.5 },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                mt: { xs: -4.5, md: -6.5 },
                p: isOwnProfile
                  ? { xs: 1.5, sm: 2.5, md: 3 }
                  : { xs: 1.25, sm: 2, md: 2.25 },
                border: "1px solid var(--border)",
                borderRadius: { xs: "18px", md: "22px" },
                background:
                  "linear-gradient(180deg, var(--surface) 0%, var(--surface-subtle) 100%)",
                boxShadow: "0 6px 20px rgb(24 34 55 / 0.07)",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isOwnProfile
                    ? { xs: "1fr", md: "minmax(0, 1.2fr) minmax(380px, 0.9fr)" }
                    : { xs: "1fr", md: "minmax(0, 1fr) auto" },
                  alignItems: "center",
                  gap: { xs: 1.75, md: 3 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.25, sm: 2.5 },
                    minWidth: 0,
                  }}
                >
                  <Box sx={{ position: "relative", flexShrink: 0 }}>
                    <Avatar
                      src={profile.photo || undefined}
                      alt={profile.name || "Profile photo"}
                      sx={{
                        width: isOwnProfile
                          ? { xs: 70, sm: 104, md: 118 }
                          : { xs: 68, sm: 82, md: 96 },
                        height: isOwnProfile
                          ? { xs: 70, sm: 104, md: 118 }
                          : { xs: 68, sm: 82, md: 96 },
                        border: "4px solid var(--surface)",
                        boxShadow:
                          "0 0 0 2px var(--accent-border), 0 5px 14px rgb(15 23 42 / 0.12)",
                        bgcolor: "var(--accent-soft)",
                        color: "var(--accent-strong)",
                        fontSize: isOwnProfile ? 36 : 30,
                      }}
                    >
                      {(profile.name || "U").charAt(0).toUpperCase()}
                    </Avatar>
                    {isOwnProfile && (
                      <Box sx={{ position: "absolute", right: -4, bottom: 0 }}>
                        <ProfilePhoto />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      component="h1"
                      sx={{
                        color: "var(--text-primary)",
                        fontSize: isOwnProfile
                          ? { xs: 20, sm: 31, md: 36 }
                          : { xs: 18, sm: 23, md: 26 },
                        fontWeight: 850,
                        letterSpacing: "-.045em",
                        lineHeight: 1.1,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {profile.name || "VibeHub member"}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        color: "var(--text-secondary)",
                        fontSize: isOwnProfile
                          ? { xs: 12, sm: 17 }
                          : { xs: 12, sm: 15 },
                        fontWeight: 550,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {username}
                    </Typography>

                    {isOwnProfile && (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.7,
                          mt: 1.25,
                          px: 1.25,
                          py: 0.55,
                          border: "1px solid var(--accent-border)",
                          borderRadius: "999px",
                          bgcolor: "var(--accent-soft)",
                          color: "var(--accent-strong)",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        <GroupsOutlined sx={{ fontSize: 16 }} />
                        VibeHub member
                      </Box>
                    )}
                  </Box>
                </Box>

                {isOwnProfile ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: { xs: 1, sm: 1.25 },
                    }}
                  >
                    {stats.map((stat) => (
                      <Box
                        key={stat.label}
                        sx={{
                          minHeight: { xs: 70, sm: 92 },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.25,
                          px: 0.5,
                          border: "1px solid var(--border)",
                          borderRadius: "16px",
                          bgcolor: "var(--surface)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "var(--text-muted)",
                          }}
                        >
                          {stat.icon}
                          <Typography
                            sx={{
                              fontSize: { xs: 8, sm: 11 },
                              fontWeight: 750,
                              textTransform: "uppercase",
                              letterSpacing: ".025em",
                              textAlign: "center",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: "var(--text-primary)",
                            fontSize: { xs: 23, sm: 28 },
                            fontWeight: 850,
                            lineHeight: 1.1,
                          }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", md: "flex-end" },
                    }}
                  >
                    <Button
                      disabled={
                        followActionUserIds.includes(id) || viewedUserLoading
                      }
                      onClick={handleFollowToggle}
                      startIcon={
                        followActionUserIds.includes(id) ? (
                          <CircularProgress size={15} color="inherit" />
                        ) : viewedUserIsFollowing ? (
                          <CheckRounded />
                        ) : (
                          <PersonAddAlt1Outlined />
                        )
                      }
                      aria-label={
                        viewedUserIsFollowing ? "Unfollow user" : "Follow user"
                      }
                      sx={{
                        minWidth: 104,
                        minHeight: 36,
                        px: 1.75,
                        borderRadius: "11px",
                        bgcolor: viewedUserIsFollowing
                          ? "var(--accent-soft)"
                          : "var(--accent-strong)",
                        color: viewedUserIsFollowing
                          ? "var(--accent-strong)"
                          : "#ffffff",
                        fontSize: 13,
                        fontWeight: 800,
                        textTransform: "none",
                        "& .MuiButton-startIcon": {
                          mr: 0.75,
                          "& > *:nth-of-type(1)": { fontSize: 18 },
                        },
                        "&:hover": {
                          bgcolor: viewedUserIsFollowing
                            ? "var(--surface-hover)"
                            : "var(--accent-border)",
                        },
                        "&:disabled": {
                          opacity: 0.72,
                        },
                        "html[data-theme='dark'] &": {
                          color: viewedUserIsFollowing
                            ? "var(--accent-strong)"
                            : "#172033",
                        },
                      }}
                    >
                      {viewedUserIsFollowing ? "Following" : "Follow"}
                    </Button>
                  </Box>
                )}
              </Box>

              {isOwnProfile && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1.45fr 0.8fr" },
                    gap: 1.5,
                    mt: { xs: 2, md: 2.5 },
                  }}
                >
                  <Box
                    sx={{
                      minHeight: 116,
                      p: { xs: 1.75, sm: 2.25 },
                      border: "1px solid var(--border)",
                      borderRadius: "17px",
                      bgcolor: "var(--surface-subtle)",
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 1.25,
                        color: "var(--text-primary)",
                        fontSize: 15,
                        fontWeight: 800,
                      }}
                    >
                      About
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        columnGap: 3,
                        rowGap: 1,
                      }}
                    >
                      {aboutItems.map((item) => (
                        <Box
                          key={item.label}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                            minWidth: 0,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {item.icon}
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "var(--text-secondary)",
                            }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: "grid", gap: 1.25 }}>
                    {[
                      {
                        label: "My posts",
                        value: posts.length,
                        icon: <ArticleOutlined />,
                      },
                      {
                        label: "Saved posts",
                        value: savedCount,
                        icon: <BookmarkBorderOutlined />,
                      },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                          px: 1.75,
                          py: 1.25,
                          border: "1px solid var(--accent-border)",
                          borderRadius: "15px",
                          bgcolor: "var(--surface-subtle)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "var(--accent-strong)",
                          }}
                        >
                          {item.icon}
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 750,
                              textTransform: "uppercase",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {item.label}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            color: "var(--text-primary)",
                            fontSize: 20,
                            fontWeight: 850,
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </Paper>

        {isOwnProfile && (
          <Paper
            elevation={0}
            sx={{
              mt: 2.25,
              p: { xs: 0.75, sm: 1 },
              border: "1px solid var(--border)",
              borderRadius: "18px",
              bgcolor: "var(--surface)",
              boxShadow: "0 2px 6px rgb(24 34 55 / 0.05)",
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 46,
                "& .MuiTabs-indicator": { display: "none" },
                "& .MuiTabs-flexContainer": { gap: 0.5 },
                "& .MuiTabs-scrollButtons": {
                  color: "var(--text-secondary)",
                },
              }}
            >
              <Tab
                icon={<ArticleOutlined />}
                iconPosition="start"
                label="My posts"
                sx={profileTabSx(tab === 0)}
              />
              <Tab
                icon={<BookmarkBorderOutlined />}
                iconPosition="start"
                label="Saved"
                sx={profileTabSx(tab === 1)}
              />
              <Tab
                icon={<PersonOutline />}
                iconPosition="start"
                label="About"
                sx={profileTabSx(tab === 2)}
              />
            </Tabs>
          </Paper>
        )}

        <Box sx={{ mt: 2 }}>
          {tab === 0 &&
            (posts.length > 0 ? (
              posts.map((post) => (
                <Box key={post._id} sx={{ mb: 2 }}>
                  <Post
                    postdata={post}
                    currentUserId={currentUserId}
                    showAllComments={false}
                    onPostChange={refetch}
                    currentUserPhoto={userData.photo || ""}
                  />
                </Box>
              ))
            ) : (
              <EmptyPanel
                title="No posts yet"
                message={
                  isOwnProfile
                    ? "Share your first post to get started."
                    : "This member hasn’t posted yet."
                }
              />
            ))}

          {isOwnProfile &&
            tab === 1 &&
            (savedPostsLoading && !savedPosts?.length ? (
              <Box
                sx={{ display: "grid", gap: 1.5 }}
                aria-label="Loading saved posts"
              >
                {[0, 1].map((item) => (
                  <Paper
                    key={item}
                    elevation={0}
                    sx={{
                      p: 2.25,
                      border: "1px solid var(--border)",
                      borderRadius: "18px",
                      bgcolor: "var(--surface)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        animation="wave"
                        width={44}
                        height={44}
                        sx={{ bgcolor: "var(--surface-muted)" }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton
                          animation="wave"
                          width="32%"
                          height={20}
                          sx={{ bgcolor: "var(--surface-muted)" }}
                        />
                        <Skeleton
                          animation="wave"
                          width="22%"
                          height={16}
                          sx={{ bgcolor: "var(--surface-muted)" }}
                        />
                      </Box>
                    </Box>
                    <Skeleton
                      animation="wave"
                      width="75%"
                      height={20}
                      sx={{
                        mt: 1.5,
                        bgcolor: "var(--surface-muted)",
                      }}
                    />
                    {item === 0 && (
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        height={190}
                        sx={{
                          mt: 1,
                          borderRadius: "14px",
                          bgcolor: "var(--surface-muted)",
                        }}
                      />
                    )}
                  </Paper>
                ))}
              </Box>
            ) : savedPostsError ? (
              <Paper
                role="alert"
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  textAlign: "center",
                  border: "1px solid var(--danger-border)",
                  borderRadius: "18px",
                  bgcolor: "var(--surface)",
                }}
              >
                <ErrorOutlineRounded
                  sx={{
                    color: "var(--danger-text)",
                    fontSize: 30,
                    mb: 0.5,
                  }}
                />
                <Typography
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 800,
                  }}
                >
                  Saved posts couldn’t load
                </Typography>
                <Typography
                  sx={{
                    mt: 0.5,
                    color: "var(--text-muted)",
                    fontSize: 13.5,
                  }}
                >
                  {savedPostsError}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<RefreshRounded />}
                  onClick={() =>
                    dispatch(getUserBookmarks({ page: 1, limit: 20 }))
                  }
                  sx={{
                    mt: 1.75,
                    borderRadius: "11px",
                    fontWeight: 750,
                    textTransform: "none",
                    boxShadow: "none",
                    bgcolor: "var(--accent-strong)",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "var(--accent-border)",
                      boxShadow: "none",
                    },
                    "html[data-theme='dark'] &": {
                      color: "#172033",
                    },
                  }}
                >
                  Try again
                </Button>
              </Paper>
            ) : savedPosts?.length ? (
              savedPosts.map((post) => (
                <Box key={post._id} sx={{ mb: 2 }}>
                  <Post
                    postdata={post}
                    currentUserId={currentUserId}
                    showAllComments={false}
                    currentUserPhoto={userData.photo || ""}
                  />
                </Box>
              ))
            ) : (
              <EmptyPanel
                title="No saved posts"
                message="Posts you bookmark will appear here."
              />
            ))}

          {isOwnProfile && tab === 2 && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                border: "1px solid var(--border)",
                borderRadius: "18px",
                bgcolor: "var(--surface)",
              }}
            >
              <Typography
                sx={{
                  mb: 2,
                  color: "var(--text-primary)",
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                About {profile.name || "this member"}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1.25,
                }}
              >
                {[
                  {
                    label: "Email address",
                    value: isOwnProfile ? profile.email : "",
                    icon: <EmailOutlined />,
                  },
                  {
                    label: "Date of birth",
                    value: isOwnProfile
                      ? formatDateOfBirth(profile.dateOfBirth)
                      : "",
                    icon: <CalendarMonthOutlined />,
                  },
                  {
                    label: "Gender",
                    value: isOwnProfile ? profile.gender : "",
                    icon: <PersonOutline />,
                  },
                  {
                    label: "Member since",
                    value: aboutItems.find(
                      (item) => item.label === "Member since",
                    )?.value,
                    icon: <CalendarMonthOutlined />,
                  },
                ]
                  .filter((item) => item.value)
                  .map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        p: 1.5,
                        borderRadius: "13px",
                        bgcolor: "var(--surface-subtle)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.icon}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "var(--text-muted)",
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: ".04em",
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.25,
                            color: "var(--text-secondary)",
                            fontSize: 14,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
}

function profileTabSx(active: boolean): SxProps<Theme> {
  return {
    minHeight: 42,
    px: { xs: 1.5, sm: 2 },
    borderRadius: "12px",
    color: active ? "var(--accent-strong)" : "var(--text-secondary)",
    bgcolor: active ? "var(--accent-soft)" : "transparent",
    fontSize: 13,
    fontWeight: 750,
    textTransform: "none",
    "&:hover": {
      bgcolor: active ? "var(--accent-soft)" : "var(--surface-hover)",
    },
    "& .MuiTab-iconWrapper": {
      fontSize: 18,
      mr: 0.75,
    },
  };
}

function EmptyPanel({ title, message }: { title: string; message: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        py: 7,
        px: 2,
        textAlign: "center",
        border: "1px solid var(--border)",
        borderRadius: "18px",
        bgcolor: "var(--surface)",
      }}
    >
      <Typography
        sx={{
          color: "var(--text-primary)",
          fontSize: 17,
          fontWeight: 750,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          mt: 0.75,
          color: "var(--text-muted)",
          fontSize: 14,
        }}
      >
        {message}
      </Typography>
    </Paper>
  );
}

function formatDateOfBirth(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
