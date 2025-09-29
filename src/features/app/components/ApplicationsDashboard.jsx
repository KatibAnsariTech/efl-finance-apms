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
import { useAccount } from "src/hooks/use-account";

const applications = [
  {
    id: "credit-deviation",
    title: "Credit Deviation",
    description:
      "Access all credit deviation related features including requests, approvals, master data, and user management",
    status: "active",
    color: "#8B4513",
    route: "/credit-deviation",
    projectType: "CRD",
  },
  {
    id: "import-payment",
    title: "Import Payment",
    description:
      "Increase practice efficiency by 45% with automated workflows and smart scheduling",
    status: "active",
    color: "#2E7D32",
    route: "/import-payment",
    projectType: "IP",
  },
  {
    id: "journal-voucher-manager",
    title: "Journal Voucher Manager",
    description:
      "Find specialist matches 5x faster with AI-powered credentialing and availability data.",
    status: "active",
    pendingCount: 23,
    color: "#00695C",
    route: "/jvm",
    projectType: "JVM",
  },
  {
    id: "custom-duty",
    title: "Custom Duty",
    description:
      "Track 95% of healthcare network changes to maintain accurate provider directories",
    status: "active",
    pendingCount: 20,
    color: "#7B1FA2",
    route: "/custom-duty",
    projectType: "CD",
  },
  {
    id: "vendor-onboarding",
    title: "Vendor Onboarding",
    description:
      "Achieve 99% data accuracy with comprehensive patient record enrichment and validation.",
    status: "coming-soon",
    color: "#1976D2",
    route: "/vendor-onboarding",
    projectType: "VO",
  },
  {
    id: "petty-cash",
    title: "Petty Cash",
    description:
      "Access clinical evidence 10x faster with AI-curated medical research and guidelines.",
    status: "active",
    color: "#9C27B0",
    route: "/petty-cash",
    projectType: "PC",
  },
];

export default function ApplicationsDashboard() {
  const router = useRouter();
  const account = useAccount();

  // Filter applications based on user's accessible projects
  const accessibleApplications = applications.filter(app => {
    // Only show applications for projects the user has access to
    return account?.accessibleProjects?.includes(app.projectType);
  });

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
      {accessibleApplications.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "text.secondary",
              marginBottom: 2,
              fontFamily: "Arial, sans-serif",
            }}
          >
            No Accessible Projects
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontFamily: "Arial, sans-serif",
            }}
          >
            You don't have access to any projects yet. Please contact your administrator.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {accessibleApplications.map((app, index) => {
            // Maintain original layout: first 2 cards are md=3, third card is md=6, rest are md=3
            let gridSize = 3;
            if (index === 2) gridSize = 6; // Third card is wider
            
            return (
            <Grid 
              key={app.id} 
              item 
              xs={12} 
              sm={6} 
              md={gridSize}
            >
            <Card
              sx={{
                height: "240px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${app.color} 0%, ${app.color}dd 100%)`,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
              }}
              onClick={() => handleCardClick(app.route)}
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
                  {app.title}
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
                  {app.description}
                </Typography>

                {app.status === "coming-soon" ? (
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
                ) : app.status === "active" ? (
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
                    {app.pendingCount} Pending
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
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
