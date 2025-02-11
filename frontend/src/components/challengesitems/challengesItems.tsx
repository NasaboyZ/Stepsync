"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { fetchChallenges } from "@/utils/api";
import { Challenge } from "@/types/interfaces/challenges";
import {
  Modal,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./challengesItems.module.css";
import { CreateChallenge } from "@/types/interfaces/challenges";
import { ChallengesCard } from "../challengersCard/challengesCard";

import { challengesSchema } from "@/validations/challenges-shema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createChallenge, updateChallenge } from "@/services/servicesChallenge";
import { useSnackbarStore } from "@/store/snackbarStore";

const emptyChallenge: CreateChallenge = {
  title: "",
  description: "",
};

export default function ChallengesItems() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState<Challenge | CreateChallenge>(
    emptyChallenge
  );

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const [selectedTab, setSelectedTab] = useState(0);

  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        if (!session?.accessToken) return;
        const challengesData = await fetchChallenges(session.accessToken);
        setChallenges(Array.isArray(challengesData) ? challengesData : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
        );
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, [session]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNewChallenge(emptyChallenge);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (field: keyof CreateChallenge, value: string) => {
    setNewChallenge((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChallenge = async () => {
    if (!session?.accessToken) {
      console.log("Keine Authentifizierung vorhanden");
      return;
    }

    try {
      challengesSchema.parse(newChallenge);
      setValidationErrors({});

      if ("id" in newChallenge && newChallenge.id !== undefined) {
        await updateChallenge(
          {
            id: newChallenge.id.toString(),
            title: newChallenge.title,
            description: newChallenge.description,
            status: newChallenge.status || "pending",
          },
          session.accessToken,
          router,
          () => {
            setIsModalOpen(false);

            if (newChallenge.status === "completed") {
              showSnackbar(
                "Challenge erfolgreich abgeschlossen! 🎉",
                "success"
              );
            } else if (newChallenge.status === "failed") {
              showSnackbar(
                "Challenge nicht geschafft. Beim nächsten Mal klappt es bestimmt! 💪",
                "info"
              );
            }

            const loadChallenges = async () => {
              const challengesData = await fetchChallenges(
                session.accessToken!
              );
              setChallenges(
                Array.isArray(challengesData) ? challengesData : []
              );
            };
            loadChallenges();
          }
        );
      } else {
        await createChallenge(
          {
            title: newChallenge.title,
            description: newChallenge.description,
            status: "pending",
          },
          session.accessToken,
          router,
          () => {
            setIsModalOpen(false);
            showSnackbar("Neue Challenge erstellt! 🎯", "success");

            const loadChallenges = async () => {
              const challengesData = await fetchChallenges(
                session.accessToken!
              );
              setChallenges(
                Array.isArray(challengesData) ? challengesData : []
              );
            };
            loadChallenges();
          }
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setValidationErrors(errors);
        showSnackbar("Bitte überprüfen Sie Ihre Eingaben", "error");
      } else {
        console.error("Fehler beim Speichern der Challenge:", error);
        showSnackbar("Fehler beim Speichern der Challenge", "error");
      }
    }
  };

  const handleEditChallenge = (challenge: Challenge) => {
    setNewChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        className={styles.challengeHeader}
      >
        Challenges
      </Typography>

      <Box
        className={styles.tabsContainer}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          width: "100%",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="challenge periods"
          className={styles.tabs}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: { backgroundColor: "#E31E24", height: "2px" },
          }}
          sx={{
            minHeight: "35px",
            "& .MuiTab-root": {
              minHeight: "35px",
              padding: "6px 16px",
              fontSize: "14px",
            },
          }}
        >
          <Tab
            label="Heute"
            sx={{
              color: selectedTab === 0 ? "#E31E24" : "#000",
              textTransform: "none",
              fontWeight: selectedTab === 0 ? 600 : 400,
              minHeight: "35px",
            }}
          />
          <Tab
            label="Last 7 Days"
            sx={{
              color: selectedTab === 1 ? "#E31E24" : "#000",
              textTransform: "none",
              fontWeight: selectedTab === 1 ? 600 : 400,
              minHeight: "35px",
            }}
          />
          <Tab
            label="Month"
            sx={{
              color: selectedTab === 2 ? "#E31E24" : "#000",
              textTransform: "none",
              fontWeight: selectedTab === 2 ? 600 : 400,
              minHeight: "35px",
            }}
          />
        </Tabs>

        <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="contained"
            onClick={handleOpenModal}
            className={styles.newChallengeButton}
            fullWidth={true}
          >
            Neue Challenge
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {challenges
          .filter((challenge) => challenge.status === "pending")
          .map((challenge) => (
            <Grid item xs={12} key={challenge.id}>
              <ChallengesCard
                variant="primary"
                challenge={challenge}
                onEdit={() => handleEditChallenge(challenge)}
              />
            </Grid>
          ))}
      </Grid>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="challenge-modal"
            closeAfterTransition
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.modalContent}>
                <h2>Challenge bearbeiten</h2>
                <TextField
                  label="Titel"
                  fullWidth
                  value={newChallenge.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  margin="normal"
                  error={!!validationErrors.title}
                />
                {validationErrors.title && (
                  <div className={styles.errorMessage}>
                    {validationErrors.title}
                  </div>
                )}
                <TextField
                  label="Beschreibung"
                  fullWidth
                  value={newChallenge.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  margin="normal"
                  error={!!validationErrors.description}
                />
                {validationErrors.description && (
                  <div className={styles.errorMessage}>
                    {validationErrors.description}
                  </div>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChallenge}
                >
                  Speichern
                </Button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
