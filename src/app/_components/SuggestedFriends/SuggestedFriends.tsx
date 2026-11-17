"use client";

import { getFollowSuggestions, toggleFollowUser } from "@/lib/profileSlice";
import { dispatchType, stateType } from "@/lib/store";
import {
  GroupAddOutlined,
  GroupsOutlined,
  PersonAddAlt1Outlined,
  CheckRounded,
  PeopleAltOutlined,
  SearchOutlined,
  ErrorOutlineRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function SuggestedFriends() {
  const dispatch = useDispatch<dispatchType>();
  const router = useRouter();
  const {
    followSuggestions,
    suggestionsLoaded,
    suggestionsLoading,
    suggestionsError,
    suggestionsHasMore,
    suggestionsPage,
    followStatusByUserId,
    followActionUserIds,
  } = useSelector((state: stateType) => state.profile);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!suggestionsLoaded && !suggestionsLoading && !suggestionsError) {
      dispatch(getFollowSuggestions({ page: 1, limit: 5 }));
    }
  }, [dispatch, suggestionsLoaded, suggestionsError, suggestionsLoading]);

  const filteredSuggestions = useMemo(() => {
    const query = search.trim().replace(/^@/, "").toLowerCase();
    if (!query) return followSuggestions;

    return followSuggestions.filter((user) =>
      `${user.name} ${user.username}`.toLowerCase().includes(query),
    );
  }, [followSuggestions, search]);
  const visibleSuggestions = filteredSuggestions;

  async function handleFollowToggle(userId: string, name: string) {
    try {
      const result = await dispatch(toggleFollowUser({ userId })).unwrap();
      toast.success(result.following ? `Following ${name}` : `Unfollowed ${name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update follow status");
    }
  }

  return (
    <Paper
      component="aside"
      elevation={0}
      sx={{
        position: "sticky",
        top: 76,
        alignSelf: "start",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        p: { xs: 1.5, sm: 1.75 },
        border: "1px solid #dce4ee",
        borderRadius: "22px",
        background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
        boxShadow: "0 8px 24px rgb(24 34 55 / 0.07)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.5, flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, minWidth: 0 }}>
          <Box sx={{ width: 38, height: 38, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: "13px", bgcolor: "#eaf3ff", color: "#0878ff" }}>
            <GroupAddOutlined sx={{ fontSize: 21 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#172033", fontSize: 15, fontWeight: 850, lineHeight: 1.2 }} noWrap>
              Suggested friends
            </Typography>
            <Typography sx={{ mt: 0.3, color: "#8291a7", fontSize: 11.5 }} noWrap>
              People you may know
            </Typography>
          </Box>
        </Box>
        <Chip
          size="small"
          label={
            filteredSuggestions.length
          }
          sx={{ height: 27, minWidth: 29, bgcolor: "#f0f4f9", color: "#40516c", fontWeight: 800, border: "1px solid #e6edf5" }}
        />
      </Box>

      <TextField
        fullWidth
        size="small"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search friends..."
        inputProps={{ "aria-label": "Search suggested friends" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined sx={{ color: "#8a9ab0", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 1.5,
          flexShrink: 0,
          "& .MuiOutlinedInput-root": {
            height: 44,
            borderRadius: "14px",
            bgcolor: "#f7f9fc",
            fontSize: 13,
            "& fieldset": { borderColor: "#e1e8f1" },
            "&:hover fieldset": { borderColor: "#c7d5e6" },
            "&.Mui-focused fieldset": { borderColor: "#70aafa" },
          },
        }}
      />

      {suggestionsLoading && followSuggestions.length === 0 ? (
        <Box sx={{ display: "grid", gap: 1 }} aria-label="Loading friend suggestions">
          {[0, 1, 2].map((item) => (
            <Paper key={item} elevation={0} sx={{ p: 1.25, border: "1px solid #e5ebf3", borderRadius: "16px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Skeleton variant="circular" animation="wave" width={42} height={42} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton animation="wave" width="72%" height={19} />
                  <Skeleton animation="wave" width="48%" height={16} />
                </Box>
                <Skeleton variant="rounded" animation="wave" width={70} height={32} sx={{ borderRadius: 8 }} />
              </Box>
              <Skeleton animation="wave" width="42%" height={23} sx={{ mt: 0.75 }} />
            </Paper>
          ))}
        </Box>
      ) : suggestionsError && followSuggestions.length === 0 ? (
        <Box role="alert" sx={{ py: 2.5, px: 1.5, textAlign: "center", border: "1px solid #f4d8d8", borderRadius: "16px", bgcolor: "#fffafa" }}>
          <ErrorOutlineRounded sx={{ color: "#d14343", fontSize: 25, mb: 0.5 }} />
          <Typography sx={{ color: "#26354b", fontSize: 13, fontWeight: 750 }}>Suggestions unavailable</Typography>
          <Typography sx={{ mt: 0.4, color: "#71809a", fontSize: 12, lineHeight: 1.5 }}>{suggestionsError}</Typography>
          <Button
            size="small"
            onClick={() => dispatch(getFollowSuggestions({ page: 1, limit: 5 }))}
            sx={{ mt: 0.75, textTransform: "none", fontWeight: 750 }}
          >
            Retry
          </Button>
        </Box>
      ) : visibleSuggestions.length === 0 ? (
        <Typography sx={{ py: 3, color: "#71809a", fontSize: 13, textAlign: "center" }}>
          {followSuggestions.length ? "No matches found." : "No suggestions available right now."}
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            alignContent: "start",
            gap: 0.9,
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          {visibleSuggestions.map((user) => {
            const isFollowing = followStatusByUserId[user._id] ?? false;
            const isUpdating = followActionUserIds.includes(user._id);

            return <Box
              key={user._id}
              sx={{
                width: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                p: 1.15,
                border: "1px solid #e5ebf3",
                borderRadius: "17px",
                background: "linear-gradient(145deg, #ffffff 0%, #fbfdff 100%)",
                boxShadow: "0 1px 2px rgb(15 23 42 / 0.025)",
                transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
                "&:hover": {
                  borderColor: "#bfd8f7",
                  boxShadow: "0 5px 14px rgb(23 105 232 / 0.08)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                <ButtonBase
                  onClick={() => router.push(`/profile/${user._id}`)}
                  aria-label={`View ${user.name.trim()}'s profile`}
                  sx={{ flexShrink: 0, borderRadius: "50%" }}
                >
                  <Avatar
                    src={user.photo || undefined}
                    alt={user.name}
                    sx={{ width: 44, height: 44, bgcolor: "#e7f2ff", color: "#1769e8", fontWeight: 750, border: "2px solid #fff", boxShadow: "0 0 0 1px #dbe7f5, 0 2px 5px rgb(15 23 42 / 0.08)" }}
                  >
                    {(user.name || "U").trim().charAt(0).toUpperCase()}
                  </Avatar>
                </ButtonBase>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    component="button"
                    onClick={() => router.push(`/profile/${user._id}`)}
                    sx={{
                      display: "block",
                      maxWidth: "100%",
                      p: 0,
                      border: 0,
                      bgcolor: "transparent",
                      color: "#172033",
                      font: "inherit",
                      fontSize: 13.5,
                      fontWeight: 800,
                      letterSpacing: "-.01em",
                      textAlign: "left",
                      cursor: "pointer",
                      "&:hover": { color: "#1769e8" },
                    }}
                    noWrap
                  >
                    {user.name.trim()}
                  </Typography>
                  <Typography sx={{ mt: 0.15, color: "#71809a", fontSize: 11.5 }} noWrap>
                    @{user.username.replace(/^@/, "")}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={isUpdating ? <CircularProgress size={14} color="inherit" /> : isFollowing ? <CheckRounded sx={{ fontSize: 16 }} /> : <PersonAddAlt1Outlined sx={{ fontSize: 16 }} />}
                  onClick={() => handleFollowToggle(user._id, user.name.trim())}
                  disabled={isUpdating}
                  aria-label={`${isFollowing ? "Unfollow" : "Follow"} ${user.name.trim()}`}
                  sx={{
                    minWidth: 0,
                    flexShrink: 0,
                    px: 1.1,
                    minHeight: 31,
                    borderRadius: "999px",
                    bgcolor: isFollowing ? "#f1f4f8" : "#eaf3ff",
                    color: isFollowing ? "#40516c" : "#1769e8",
                    fontSize: 11.5,
                    fontWeight: 750,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: isFollowing ? "#e7ecf3" : "#dcecff" },
                    "& .MuiButton-startIcon": { mr: 0.4 },
                  }}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.65, mt: 1.1 }}>
                <Chip
                  size="small"
                  icon={<GroupsOutlined sx={{ fontSize: "15px !important" }} />}
                  label={`${(user.followersCount ?? 0).toLocaleString()} followers`}
                  sx={{ height: 24, bgcolor: "#f1f4f8", color: "#60728b", fontSize: 11, "& .MuiChip-icon": { color: "#75869d", ml: 0.75 } }}
                />
                {user.mutualFollowersCount > 0 && (
                  <Chip
                    size="small"
                    icon={<PeopleAltOutlined sx={{ fontSize: "14px !important" }} />}
                    label={`${user.mutualFollowersCount} mutual`}
                    sx={{ height: 24, bgcolor: "#edf5ff", color: "#1769e8", fontSize: 11, "& .MuiChip-icon": { color: "#1769e8", ml: 0.75 } }}
                  />
                )}
              </Box>
            </Box>
          })}
        </Box>
      )}
      {suggestionsHasMore && (
        <Button
          fullWidth
          disabled={suggestionsLoading}
          onClick={() =>
            dispatch(
              getFollowSuggestions({ page: suggestionsPage + 1, limit: 5 }),
            )
          }
          sx={{
            mt: 1.25,
            minHeight: 40,
            flexShrink: 0,
            border: "1px solid #dce8f6",
            borderRadius: "13px",
            bgcolor: "#f5f9ff",
            color: "#1769e8",
            fontWeight: 750,
            textTransform: "none",
            "&:hover": { bgcolor: "#eaf3ff", borderColor: "#c8ddf7" },
          }}
        >
          {suggestionsLoading ? "Loading…" : "View more"}
        </Button>
      )}
    </Paper>
  );
}
