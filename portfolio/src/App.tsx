import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar'; // Import Avatar
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import FolderIcon from '@mui/icons-material/Folder';
import Chip from '@mui/material/Chip'; // Add this import

// Import from within the src directory
import portrait from './portrait.jpeg';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7A67E0',
    },
    secondary: {
      main: '#A99CFF',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

const sections = [
  {
    id: 'about',
    title: 'About Me',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    content: 'Originally from southern Germany, I\'ve journeyed through Frankfurt and Hanover to Switzerland. My passion lies in the intersection of technology and human behavior, combining humanities background with technical expertise. When not coding, I enjoy running and diving into great books.',
  },
  {
    id: 'skills',
    title: 'Technical Skills',
    icon: <DataObjectIcon sx={{ fontSize: 40 }} />,
    content: 'Python (NumPy, SciPy, Scikit-learn, Keras, PyTorch, FastAPI), R (Tidyverse, Shiny), SQL (PostgreSQL, MongoDB), JavaScript (React, Nuxt), Git, Docker, Kubernetes, Azure, Cloudflare, Linux',
  },
  {
    id: 'experience',
    title: 'Current Roles',
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
    content: 'Data Engineer @ University of Lucerne (Sep 2023-Present): Building an online platform for legal data. NLP Researcher @ University of Lucerne (Feb 2024-Aug 2024): Applying BERT to research digital payments from a sociological perspective.',
  },
  {
    id: 'education',
    title: 'Education',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    content: 'Master of Arts in Computational Social Sciences @ University of Lucerne (2022-2024), Bachelor of Arts in Media Management @ Hochschule für Musik, Theater und Medien Hannover (2019-2022), European Baccalaureate @ European School Frankfurt',
  },
  {
    id: 'languages',
    title: 'Languages',
    icon: <LanguageIcon sx={{ fontSize: 40 }} />,
    content: 'German (C2 - Native), English (C1 - Fluent), Spanish (B1 - Basic)',
  },
  {
    id: 'interests',
    title: 'Fields of Interest',
    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
    content: 'Natural Language Processing, Automated Content Analysis, Cloud Computing, Machine Learning, Data-Driven Development, Statistical Modelling & Inference',
  },
];

const projects = [
  {
    id: 'project-cold',
    title: 'Choice of Law Dataverse',
    description: 'Created an open-access platform for private international law research data using Airtable, SQL, Python, Flask, and advanced language models for semantic search. Led data architecture and software development to enhance legal research accessibility.',
    link: 'https://www.choiceoflawdataverse.com/',
    linkText: 'Project Website',
    technologies: ['Airtable', 'SQL', 'Python', 'Flask', 'LLM', 'React'] // Added technologies
  },
  {
    id: 'project-nlp',
    title: 'Digital Payments NLP',
    description: 'Utilized NLP, BERTopic, and GPT-3.5 Turbo to analyze digital payments industry texts. Conducted research for a Master’s thesis, achieving top grades and continued contributions to the research project through technical skills.',
    link: 'https://github.com/simonweigold/business-reports-nlp',
    linkText: 'GitHub Repository',
    technologies: ['Python', 'NLP', 'BERTopic', 'GPT-3.5', 'Transformers'] // Added technologies
  },
  {
    id: 'project-spotify',
    title: 'Spotify Network Analysis',
    description: 'Examined the link between an artist\'s collaboration network and their musical success using data mining of Spotify data, social network analysis, penalized regression, ANOVA, and various data visualization techniques. Achieved top grades for a seminar paper.',
    link: 'https://github.com/simonweigold/spotify-charts-network',
    linkText: 'GitHub Repository',
    technologies: ['Python', 'Data Mining', 'SNA', 'Regression', 'ANOVA', 'Spotify API'] // Added technologies
  },
  {
    id: 'project-twitter',
    title: 'Twitter Sentiment Analysis',
    description: 'Explored public discourse on Twitter about Elon Musk\'s acquisition using data mining, sentiment analysis, roBERTa, VADER, and NLTK. Achieved excellent grades for a seminar paper.',
    link: 'https://github.com/simonweigold/twitter-sentiment-analysis',
    linkText: 'GitHub Repository',
    technologies: ['Python', 'Data Mining', 'Sentiment Analysis', 'roBERTa', 'VADER', 'NLTK'] // Added technologies
  },
];

function App() {
  const paperCutShadow = '4px 4px 0px rgba(0, 0, 0, 0.3)';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 8,
            }}
          >
            {/* Portrait Avatar */}
            <Avatar
              alt="Simon Weigold"
              src={portrait} // Use the imported portrait image
              sx={{
                width: 120, // Adjust size as needed
                height: 120,
                mb: 2, // Margin below the avatar
                border: `3px solid ${theme.palette.secondary.main}` // Optional border
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textAlign: 'center',
                mb: 1, // Reduced margin bottom
              }}
            >
              Simon Weigold
            </Typography>
            {/* Quote (replaces keywords) */}
            <Typography
              variant="h5" // Use h5 or adjust as needed for styling
              component="h2"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.4rem' }, // Adjust font size
                textAlign: 'center',
                color: 'text.secondary',
                fontStyle: 'italic', // Optional: italicize the quote
                maxWidth: '700px', // Limit width for better readability
                mb: 4,
              }}
            >
              "Bridging Data Engineering and Social Science to Build Intelligent, Impactful Solutions"
            </Typography>

                        {/* Social Links */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 4 }}> {/* Container for icons */}
              <IconButton
                aria-label="GitHub profile"
                component="a" // Use anchor tag behavior
                href="https://github.com/simonweigold"
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Security best practice
                sx={{ color: 'text.secondary' }} // Use secondary text color
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                aria-label="LinkedIn profile"
                component="a"
                href="https://linkedin.com/in/simonweigold"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'text.secondary' }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Chronological Sections */}
          <Box sx={{ mb: 8 }}> {/* Container for chronological sections */}
            {sections.map((section) => (
              // Removed Grid item wrapper
              <Paper
                key={section.id} // Key moved to the Paper component
                // elevation={0} // Keep or remove based on desired paper-cut effect
                sx={{
                  p: 3,
                  // Removed height: '100%' as it's less relevant in vertical flow
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: paperCutShadow,
                  mb: 4, // Add margin bottom for spacing between sections
                  // Removed hover effect for simplicity, can be added back if needed
                }}
              >
                {section.icon}
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mt: 2, mb: 1 }}
                >
                  {section.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {section.content}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Projects Section (remains as a Grid) */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderIcon sx={{ fontSize: 40, mr: 1 }} /> Projects
            </Typography>
            <Grid container spacing={4}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Card sx={{
                    // height: '100%', // Remove or comment out height: 100%
                    aspectRatio: '1 / 1', // Enforce square aspect ratio
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between', // Adjust content distribution
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: paperCutShadow,
                    elevation: 0,
                   }}>
                    {/* CardMedia removed */}
                    <CardContent sx={{ flexGrow: 1, overflow: 'auto' /* Add overflow handling */ }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 /* Add margin below description */ }}>
                        {project.description}
                      </Typography>
                       {/* Technologies Section */}
                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' /* Push chips towards bottom */ }}>
                        {project.technologies.map((tech) => (
                          <Chip key={tech} label={tech} size="small" variant="outlined" sx={{ borderColor: 'secondary.main', color: 'secondary.main' }} />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ mt: 'auto' /* Ensure actions are at the bottom */ }}>
                      <Button
                        size="small"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'secondary.main' }}
                      >
                        {project.linkText}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
