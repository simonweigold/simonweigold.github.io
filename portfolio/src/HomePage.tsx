import React, { useState, useMemo, useEffect } from 'react';
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
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// Import from within the src directory
import portrait from './portrait.jpeg';

// Define structure for section content
interface SectionContentItem {
  type: 'heading' | 'subheading' | 'paragraph' | 'list' | 'skillsList';
  text: string | string[] | JSX.Element;
  skills?: string[];
}

interface Section {
  id: string;
  title: string;
  content: SectionContentItem[];
}

// Sections data structure and content
const sections: Section[] = [
  {
    id: 'about',
    title: 'Who Am I?',
    content: [
      { type: 'paragraph', text: 'Originally from a small town in southern Germany, my journey through Frankfurt and Hanover has led me back south to the heart of Switzerland. Each new location has broadened my perspectives and allowed me to grow into the person I am today.' },
      { type: 'paragraph', text: 'My initial interest in media\'s role within society quickly evolved into a fascination with the dynamic interplay between technology and human behavior—a perfect intersection of my personal interests and professional goals. Now, with a solid foundation in the humanities and robust technical skills, I am using my knowledge to solve interdisciplinary problems and create innovative solutions.' },
      { type: 'paragraph', text: (
        <>
        Away from the computer screen, I unwind by running. I document my running journey on{' '}
        <a href="https://trailventure.net" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
          Trailventure
        </a>
        .
      </>
      )
      },
    ],
  },
  {
    id: 'skills',
    title: 'What Do I Know?',
    content: [
      { type: 'subheading', text: 'Technical Skills' },
      { type: 'skillsList', text: ['Python', 'Pandas', 'NumPy', 'SciPy', 'Scikit-learn', 'Keras', 'PyTorch', 'Langchain', 'Langgraph', 'FastAPI', 'Flask', 'Pydantic', 'Pytest'] },
      { type: 'skillsList', text: ['R', 'Tidyverse', 'Shiny'] },
      { type: 'skillsList', text: ['JavaScript', 'React', 'Nuxt', 'Vue', 'Express'] },
      { type: 'skillsList', text: ['Databases', 'PostgreSQL (pgvector, full text search)', 'Microsoft SQL Server', 'MongoDB'] },
      { type: 'skillsList', text: ['DevOps', 'Git', 'GitHub Actions', 'Docker', 'Kubernetes', 'Ubuntu'] },
      { type: 'skillsList', text: ['Cloud Computing', 'Azure', 'GCP', 'Cloudflare'] },
      { type: 'skillsList', text: ['Data Analysis', 'NLP', 'Content Analysis', 'Network Analysis', 'Machine Learning', 'Statistics'] },
      { type: 'skillsList', text: ['Other Tools', 'LaTeX', 'VBA', 'SPSS', 'Airtable'] },
      //{ type: 'subheading', text: 'Languages' },
      //{ type: 'list', text: ['German (C2 - Native)', 'English (C1 - Fluent)', 'Spanish (B1 - Basic)'] },
      { type: 'subheading', text: 'Fields of Interest' },
      { type: 'list', text: ['Natural Language Processing', 'Automated Content Analysis', 'Cloud Computing', 'Machine Learning', 'Data-Driven Development', 'Statistical Modelling & Inference'] },
    ],
  },
  {
    id: 'experience',
    title: 'What Do I Do?',
    content: [
      { type: 'subheading', text: 'Fullstack Developer @ Coop Rechtsschutz (Oct 2025 - Present)' },
      { type: 'paragraph', text: 'Helping legal professionals work more efficiently', skills: ['FastAPI', 'PostgreSQL', 'Vue', 'GCP'] },
      { type: 'subheading', text: 'Data Engineer @ University of Lucerne (Sep 2023 - Sep 2025)' },
      { type: 'paragraph', text: 'Building an online platform for legal data.', skills: ['Python', 'FastAPI', 'PostgreSQL', 'Airtable', 'Azure', 'SCRUM'] },
      { type: 'subheading', text: 'NLP Researcher @ University of Lucerne (Feb 2024 - Aug 2024)' },
      { type: 'paragraph', text: 'Applying BERT to research digital payments from a sociological perspective.', skills: ['Python', 'NumPy', 'PyTorch', 'NLP', 'BERT', 'Postgres (pgvector)', 'Azure', 'WhisperAI'] },
      { type: 'subheading', text: 'Junior Data Scientist @ aserto (Oct 2020 - May 2023)' },
      { type: 'paragraph', text: 'Starting as Intern, working myself up to Junior Data Scientist, using R and SPSS to analyze business problems and offer solutions based on evidence.', skills: ['R', 'SPSS', 'VBA', 'Data Analysis', 'Data Visualization'] },
      { type: 'subheading', text: 'Market Research Intern @ Ipsos (Sep 2021 - Nov 2021)' },
      { type: 'paragraph', text: 'Delivering insights to the FMCG and innovation industry through quantitative market research.', skills: ['Quantitative Research', 'Market Analysis', 'Insight Generation'] },
    ],
  },
  {
    id: 'education',
    title: 'What Qualifies Me?',
    content: [
      { type: 'subheading', text: 'Master of Arts in Computational Social Sciences @ University of Lucerne (2022-2024)' },
      { type: 'paragraph', text: 'Quantitative empirical social research; statistics; machine learning; computer science.' },
      { type: 'subheading', text: 'Bachelor of Arts in Media Management @ Hochschule für Musik, Theater und Medien Hannover (2019-2022)' },
      { type: 'paragraph', text: 'Empirical research methodology; statistics; communication; management.' },
      //{ type: 'subheading', text: 'European Baccalaureate @ European School Frankfurt' },
      //{ type: 'paragraph', text: 'Advanced courses in Physics, Music, Spanish.' },
    ],
  },
];

const projects = [
  {
    id: 'project-clerk',
    title: 'CLERK',
    description: 'Building an AI system that enables a collective production and validation of workflows for LLM-based applications.',
    link: 'https://openclerk.ch',
    linkText: 'Project Website',
    technologies: ['React', 'FastAPI', 'Langchain', 'Langgraph', 'Supabase', 'Docker', 'Azure Container Apps']
  },
  {
    id: 'project-trailventure',
    title: 'Trailventure',
    description: 'Developed a blog website for documenting my running journey. The website includes a user-friendly input and edit interface for me to easily add new blog posts even when on the go.',
    link: 'https://trailventure.net',
    linkText: 'Blog Website',
    technologies: ['React', 'Express', 'Node', 'MongoDB', 'Docker', 'Azure Container Apps']
  },
  {
    id: 'project-cold-case-analyzer',
    title: 'CoLD Case Analyzer',
    description: 'Using LLMs and AI Agents to automate the analysis of court decisions. Building a first prototype allowing legal researchers to boost their efficiency when analysing large numbers of court decisions.',
    link: 'https://github.com/choice-of-Law-Dataverse/cold-case-analysis',
    linkText: 'GitHub Repository',
    technologies: ['Python', 'Langchain', 'Langgraph', 'GPT', 'Streamlit']
  },
  {
    id: 'project-cold',
    title: 'Choice of Law Dataverse',
    description: 'Created an open-access platform for private international law research data using Airtable, SQL, Python, FastAPI, and Azure for running the technical infrastructure. Led data architecture and software development to enhance legal research accessibility.',
    link: 'https://www.choiceoflawdataverse.com/',
    linkText: 'Project Website',
    technologies: ['PostgreSQL', 'Airtable', 'Azure', 'Python', 'FastAPI', 'Langchain', 'GPT', 'Nuxt.JS']
  },
  {
    id: 'project-nlp',
    title: 'Digital Payments NLP',
    description: 'Utilized NLP, BERTopic, and GPT-3.5 Turbo to analyze digital payments industry texts. Conducted research for a Master’s thesis, achieving top grades and continued contributions to the research project through technical skills.',
    link: 'https://github.com/simonweigold/business-reports-nlp',
    linkText: 'GitHub Repository',
    technologies: ['NLP', 'Python', 'BERTopic', 'HuggingFace', 'Transformers', 'GPT', 'WhisperAI', 'PostgreSQL (pgvector)', 'Azure VMs']
  },
  {
    id: 'project-spotify',
    title: 'Spotify Network Analysis',
    description: 'Examined the link between an artist\'s collaboration network and their musical success using data mining of Spotify data, social network analysis, penalized regression, ANOVA, and various data visualization techniques. Achieved top grades for a seminar paper.',
    link: 'https://github.com/simonweigold/spotify-charts-network',
    linkText: 'GitHub Repository',
    technologies: ['R', 'Python', 'Data Mining', 'SNA', 'Regression', 'ANOVA', 'Spotify API']
  },
  {
    id: 'project-twitter',
    title: 'Twitter Sentiment Analysis',
    description: 'Explored public discourse on Twitter about Elon Musk\'s acquisition using data mining, sentiment analysis, roBERTa, VADER, and NLTK. Achieved excellent grades for a seminar paper.',
    link: 'https://github.com/simonweigold/twitter-sentiment-analysis',
    linkText: 'GitHub Repository',
    technologies: ['Python', 'Data Mining', 'Sentiment Analysis', 'roBERTa', 'VADER', 'NLTK']
  },
];

function HomePage() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    // Initialize state from localStorage or default to dark
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
    return savedMode || 'dark';
  });

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
                primary: {
                  main: '#673ab7',
                },
                secondary: {
                  main: '#7A67E0',
                },
                background: {
                  default: '#fafafa',
                  paper: '#ffffff',
                },
                text: {
                  primary: 'rgba(0, 0, 0, 0.87)',
                  secondary: '#343434',
                  disabled: 'rgba(0, 0, 0, 0.38)',
                },
              }
            : {
                // Dark mode palette
                primary: {
                  main: '#7A67E0',
                },
                secondary: {
                  main: '#A99CFF',
                },
                background: {
                  default: '#0F0F0F',
                  paper: '#111111',
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#dddddd',
                  disabled: 'rgba(255, 255, 255, 0.5)',
                },
              }),
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
      }),
    [mode],
  );

  const paperCutShadow = mode === 'dark' ? '2px 2px 2px rgba(15, 15, 15, 0.3)' : '2px 2px 2px rgba(50, 50, 50, 0.1)';

  const handleThemeChange = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
          color: 'text.primary', // Ensure text color contrasts with background
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}> {/* Adjust padding for mobile */}
          {/* Top Section with Theme Toggle */}
          <Box
            sx={{
              display: 'flex',
              // Mobile first: Column layout, centered items
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative', // Keep relative for potential absolute children like toggle
              mb: 6, // Keep margin bottom for spacing below header
              gap: 0, // Remove gap for column layout
              // Desktop overrides: Row layout, vertically centered items
              '@media (min-width: 600px)': { // Use a breakpoint like sm or md
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4, // Restore gap for row layout
              },
            }}
          >
            {/* Theme Toggle Switch - Adjusted Position */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%', // Take full width on mobile
              justifyContent: 'flex-end', // Align to the right on mobile
              mb: 2, // Add margin below toggle on mobile
              // Desktop overrides: Absolute positioning
              '@media (min-width: 600px)': {
                position: 'absolute',
                top: 0,
                right: 0,
                width: 'auto', // Reset width
                mb: 0, // Remove mobile margin
              },
            }}>
              <Brightness7Icon sx={{ color: mode === 'light' ? 'primary.main' : 'text.secondary' }} />
              <Switch
                checked={mode === 'dark'}
                onChange={handleThemeChange}
                color="secondary"
              />
              <Brightness4Icon sx={{ color: mode === 'dark' ? 'secondary.main' : 'text.secondary' }} />
            </Box>

            {/* Portrait Avatar - Adjusted Margins */}
            <Avatar
              alt="Simon Weigold"
              src={portrait}
              sx={{
                width: 120,
                height: 120,
                mb: 2, // Margin below avatar on mobile
                border: `3px solid ${theme.palette.secondary.main}`,
                // Desktop overrides: Remove bottom margin
                '@media (min-width: 600px)': {
                  mb: 0,
                },
              }}
            />

            {/* Text Content Wrapper - Adjusted Alignment */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              // Mobile first: Center align text
              alignItems: 'center',
              textAlign: 'center', // Center text within this box on mobile
              // Desktop overrides: Align text to start
              '@media (min-width: 600px)': {
                alignItems: 'flex-start',
                textAlign: 'left', // Align text left on desktop
              },
            }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 1,
                  // textAlign is handled by parent Box now
                }}
              >
                Simon Weigold
              </Typography>
              {/* Quote */}
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  // textAlign: 'center', // Remove center alignment
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  maxWidth: '700px',
                  mb: 2, // Adjusted margin bottom
                }}
              >
                "Bridging Data Engineering and Social Science to Build Intelligent, Impactful Solutions"
              </Typography>

              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button component={Link} to="/ai-tools" variant="outlined" color="secondary">
                  AI Tools Mind Map
                </Button>
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
          </Box>

          {/* Chronological Sections - Updated Rendering */}
          <Box sx={{ mb: 8 }}>
            {sections.map((section, sectionIndex) => (
              <Paper
                key={section.id}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  // alignItems: 'center', // Remove center alignment
                  // textAlign: 'center', // Remove center alignment
                  backgroundColor: 'background.paper',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`, // Adjust border based on mode
                  boxShadow: paperCutShadow,
                  mb: 4, // Add margin bottom for spacing between sections
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography
                    variant="h4" // Larger title
                    component="h2"
                    // sx={{ ml: 2 }} // Remove margin left
                  >
                    {section.title}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} /> {/* Add a divider below the title */}
                {section.content.map((item, index) => {
                  switch (item.type) {
                    case 'subheading':
                      return (
                        <Typography
                          key={index}
                          variant="h6" // Use h6 for subheadings
                          component="h3"
                          sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}
                        >
                          {item.text}
                        </Typography>
                      );
                    case 'paragraph':
                      return (
                        <Box key={index}> {/* Wrap paragraph and potential skills in a Box */}
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph // Adds bottom margin
                          >
                            {item.text}
                          </Typography>
                          {/* Render skills chips if they exist for this item */}
                          {item.skills && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: -1, mb: 2 }}> {/* Adjust margins */}
                              {item.skills.map((skill, skillIndex) => (
                                <Chip
                                  key={skillIndex}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderColor: 'secondary.main', color: 'secondary.main' }} // Style like project chips
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      );
                    case 'list':
                      return (
                        <List key={index} dense sx={{ pl: 2 }}>
                          {(item.text as string[]).map((listItem, listIndex) => (
                            <ListItem key={listIndex} disablePadding sx={{ py: 0.2 }}>
                              <ListItemText primary={`• ${listItem}`} primaryTypographyProps={{ color: 'text.secondary' }} />
                            </ListItem>
                          ))}
                        </List>
                      );
                    case 'skillsList': // Special handling for skills to use Chips
                      return (
                        <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1, mb: 1 }}>
                          {(item.text as string[]).map((skill, skillIndex) => (
                            <Chip
                              key={skillIndex}
                              label={skill}
                              size="small"
                              variant="outlined"
                              sx={skillIndex === 0
                                ? { borderColor: 'secondary.main', color: 'secondary.main' } // Highlight first skill
                                : { borderColor: 'grey.500', color: 'text.secondary' } // Default style for others
                              }
                            />
                          ))}
                        </Box>
                      );
                    default:
                      return null;
                  }
                })}
              </Paper>
            ))}
          </Box>

          {/* Projects Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Projects
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 4,
                alignItems: 'stretch',
              }}
            >
              {projects.map((project) => (
                <Box key={project.id} sx={{ display: 'flex' }}>
                  <Card
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      bgcolor: 'background.paper',
                      border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      boxShadow: paperCutShadow,
                      elevation: 0,
                    }}
                  >
                    {/* CardMedia removed */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {project.description}
                      </Typography>
                       {/* Technologies Section */}
                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
                        {project.technologies.map((tech) => (
                          <Chip key={tech} label={tech} size="small" variant="outlined" sx={{ borderColor: 'secondary.main', color: 'secondary.main' }} />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ mt: 'auto' }}>
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
                </Box>
              ))}
            </Box>
          </Box>

        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default HomePage;
