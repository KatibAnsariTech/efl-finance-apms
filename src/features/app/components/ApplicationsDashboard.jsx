import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useRouter } from "src/routes/hooks";

const applications = [
  {
    id: "credit-deviation",
    title: "Credit Deviation",
    description:
      "Access all credit deviation related features including requests, approvals, master data, and user management",
    status: "active",
    color: "#8B4513",
    route: "/credit-deviation",
  },
  {
    id: "import-payment",
    title: "Import Payment",
    description:
      "Increase practice efficiency by 45% with automated workflows and smart scheduling",
    status: "coming-soon",
    color: "#2E7D32",
    route: "/import-payment",
  },
  {
    id: "journal-voucher-manager",
    title: "Journal Voucher Manager",
    description:
      "Find specialist matches 5x faster with AI-powered credentialing and availability data.",
    status: "pending",
    pendingCount: 23,
    color: "#00695C",
    route: "/jvm",
  },
  {
    id: "custom-duty",
    title: "Custom Duty",
    description:
      "Track 95% of healthcare network changes to maintain accurate provider directories",
    status: "pending",
    pendingCount: 20,
    color: "#7B1FA2",
    route: "/custom-duty",
  },
  {
    id: "vendor-onboarding",
    title: "Vendor Onboarding",
    description:
      "Achieve 99% data accuracy with comprehensive patient record enrichment and validation.",
    status: "coming-soon",
    color: "#1976D2",
    route: "/vendor-onboarding",
  },
  {
    id: "petty-cash",
    title: "Petty Cash",
    description:
      "Access clinical evidence 10x faster with AI-curated medical research and guidelines.",
    status: "coming-soon",
    color: "#9C27B0",
    route: "/petty-cash",
  },
];

export default function ApplicationsDashboard() {
  const router = useRouter();

  const handleCardClick = (route) => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: 3,
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "240px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${applications[0].color} 0%, ${applications[0].color}dd 100%)`,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
            onClick={() => handleCardClick(applications[0].route)}
          >
            <CardContent
              sx={{
                padding: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[0].title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 1.5,
                  marginBottom: 2,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[0].description}
              </Typography>

              {applications[0].status === "coming-soon" ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontStyle: "italic",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  ...Coming Soon
                </Typography>
              ) : applications[0].status === "active" ? (
                <Button
                  sx={{
                    backgroundColor: "#28a745",
                    color: "white",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "none",
                    minWidth: "100px",
                    width: "120px",
                    "&:hover": {
                      backgroundColor: "#218838",
                    },
                  }}
                >
                  View
                </Button>
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "none",
                    minWidth: "100px",
                    width: "120px",
                    "&:hover": {
                      backgroundColor: "#c82333",
                    },
                  }}
                >
                  {applications[0].pendingCount} Pending
                </Button>
              )}
            </CardContent>

            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "120px",
                height: "120px",
                opacity: 0.1,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "240px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${applications[1].color} 0%, ${applications[1].color}dd 100%)`,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
            onClick={() => handleCardClick(applications[1].route)}
          >
            <CardContent
              sx={{
                padding: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[1].title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 1.5,
                  marginBottom: 2,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[1].description}
              </Typography>

              {applications[1].status === "coming-soon" ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontStyle: "italic",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  ...Coming Soon
                </Typography>
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "none",
                    minWidth: "100px",
                    width: "120px",
                    "&:hover": {
                      backgroundColor: "#c82333",
                    },
                  }}
                >
                  {applications[1].pendingCount} Pending
                </Button>
              )}
            </CardContent>

            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "120px",
                height: "120px",
                opacity: 0.1,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <Card
            sx={{
              height: "240px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${applications[2].color} 0%, ${applications[2].color}dd 100%)`,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
            onClick={() => handleCardClick(applications[2].route)}
          >
            <CardContent
              sx={{
                padding: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[2].title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 1.5,
                  marginBottom: 2,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[2].description}
              </Typography>

              {applications[2].status === "coming-soon" ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontStyle: "italic",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  ...Coming Soon
                </Typography>
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "none",
                    minWidth: "100px",
                    width: "120px",
                    "&:hover": {
                      backgroundColor: "#c82333",
                    },
                  }}
                >
                  {applications[2].pendingCount} Pending
                </Button>
              )}
            </CardContent>

            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "120px",
                height: "120px",
                opacity: 0.1,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{
              height: "240px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${applications[3].color} 0%, ${applications[3].color}dd 100%)`,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
            onClick={() => handleCardClick(applications[3].route)}
          >
            <CardContent
              sx={{
                padding: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[3].title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 1.5,
                  marginBottom: 2,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[3].description}
              </Typography>

              {applications[3].status === "coming-soon" ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontStyle: "italic",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  ...Coming Soon
                </Typography>
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "none",
                    minWidth: "100px",
                    width: "120px",
                    "&:hover": {
                      backgroundColor: "#c82333",
                    },
                  }}
                >
                  {applications[3].pendingCount} Pending
                </Button>
              )}
            </CardContent>

            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "120px",
                height: "120px",
                opacity: 0.1,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "240px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${applications[4].color} 0%, ${applications[4].color}dd 100%)`,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
            onClick={() => handleCardClick(applications[4].route)}
          >
            <CardContent
              sx={{
                padding: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[4].title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 1.5,
                  marginBottom: 2,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[4].description}
              </Typography>

              {applications[4].status === "coming-soon" ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontStyle: "italic",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  ...Coming Soon
                </Typography>
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "none",
                    minWidth: "100px",
                    width: "120px",
                    "&:hover": {
                      backgroundColor: "#c82333",
                    },
                  }}
                >
                  {applications[4].pendingCount} Pending
                </Button>
              )}
            </CardContent>

            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "120px",
                height: "120px",
                opacity: 0.1,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "240px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${applications[5].color} 0%, ${applications[5].color}dd 100%)`,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
            onClick={() => handleCardClick(applications[5].route)}
          >
            <CardContent
              sx={{
                padding: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 1,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[5].title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 1.5,
                  marginBottom: 2,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {applications[5].description}
              </Typography>

              {applications[5].status === "coming-soon" ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontStyle: "italic",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  ...Coming Soon
                </Typography>
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "none",
                    minWidth: "100px",
                    width: "120px",
                    "&:hover": {
                      backgroundColor: "#c82333",
                    },
                  }}
                >
                  {applications[5].pendingCount} Pending
                </Button>
              )}
            </CardContent>

            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "120px",
                height: "120px",
                opacity: 0.1,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
