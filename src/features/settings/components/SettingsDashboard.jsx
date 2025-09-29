import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { Helmet } from "react-helmet-async";

import { useAccount } from "src/hooks/use-account";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function SettingsDashboard() {
  const navigate = useNavigate();
  const account = useAccount();

  const settingsCards = [
    {
      title: "Account Information",
      description: "View and manage your account details",
      icon: "solar:user-bold-duotone",
      color: "#00A76F",
      path: "/settings/profile",
    },
    {
      title: "Security Settings",
      description: "Change password",
      icon: "solar:lock-bold-duotone",
      color: "#FF5630",
      path: "/settings/change-password",
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <Helmet>
        <title>Settings Dashboard | EFL Finance Controller</title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* User Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2.5, height: "100%" }}>
              <Stack
                spacing={2}
                sx={{ height: "100%", justifyContent: "space-between" }}
              >
                <Box>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={account?.photoURL}
                      alt={account?.displayName}
                      sx={{ width: 48, height: 48 }}
                    >
                      {account?.displayName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" noWrap>
                        {account?.username || account?.displayName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {account?.email}
                      </Typography>
                      <Box sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {account?.accessibleProjects?.map((project, index) => (
                          <Chip
                            key={index}
                            label={`${project}: ${account.projectRoles?.[project] || 'Unknown'}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                        {(!account?.accessibleProjects || account.accessibleProjects.length === 0) && (
                          <Chip
                            label="No Projects"
                            size="small"
                            color="default"
                          />
                        )}
                      </Box>
                    </Box>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Manage your account settings and preferences from here.
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Settings Options */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {settingsCards.map((card) => (
                <Grid item xs={12} sm={6} key={card.title}>
                  <Card
                    sx={{
                      p: 2.5,
                      height: "100%",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: (theme) => theme.customShadows.z20,
                      },
                    }}
                    onClick={() => handleCardClick(card.path)}
                  >
                    <Stack
                      spacing={2}
                      sx={{ height: "100%", justifyContent: "space-between" }}
                    >
                      <Box>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: `${card.color}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          <Iconify
                            icon={card.icon}
                            width={20}
                            sx={{ color: card.color }}
                          />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.description}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                        sx={{ alignSelf: "flex-start", mt: "auto" }}
                      >
                        Manage
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
