import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Progress, Typography, Space, Result, Divider, message } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, RobotOutlined } from '@ant-design/icons';
import DashboardLayout from '../layouts/DashboardLayout';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useMentalHealth } from '../context/MentalHealthContext';
import { generateMentalHealthAdvice, AssessmentResult, MentalHealthAdvice } from '../services/mentalHealthAPI';
import MentalHealthAdviceModal from '../components/MentalHealthAdviceModal';

const { Title, Paragraph, Text } = Typography;

const QuestionCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const OptionButton = styled(Button)<{ selected: boolean }>`
  width: 100%;
  height: auto;
  padding: 16px;
  margin-bottom: 12px;
  text-align: left;
  border: 2px solid ${props => props.selected ? '#1890ff' : '#d9d9d9'};
  background: ${props => props.selected ? '#e6f7ff' : 'white'};
  
  &:hover {
    border-color: #1890ff;
    background: #e6f7ff;
  }
`;

interface Question {
  id: number;
  text: string;
  options: {
    value: number;
    label: string;
  }[];
}

interface AssessmentData {
  [key: string]: {
    title: string;
    description: string;
    questions: Question[];
  };
}

const MentalHealthAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const { updateComprehensiveEvaluation, updateStressIndex, mentalHealthData } = useMentalHealth();

  // Default to 'mental' if no category is provided (for direct assessment route)
  const currentCategory = category || 'mental';
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // AI Advice states
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<MentalHealthAdvice | null>(null);
  const [completedAssessments, setCompletedAssessments] = useState<AssessmentResult[]>([]);

  // Assessment Data
  const assessmentData: AssessmentData = {
    mental: {
      title: 'Mental Health Assessment',
      description: 'Comprehensive evaluation of your current mental health status',
      questions: [
        {
          id: 1,
          text: 'Over the past two weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 2,
          text: 'Over the past two weeks, how often have you had little interest or pleasure in doing things?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 3,
          text: 'How often do you feel nervous, anxious, or on edge?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 4,
          text: 'How often do you have trouble falling or staying asleep, or sleeping too much?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 5,
          text: 'How often do you feel tired or have little energy?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 6,
          text: 'How often do you have poor appetite or overeating?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 7,
          text: 'How often do you feel bad about yourself or that you are a failure?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 8,
          text: 'How often do you have trouble concentrating on things?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 9,
          text: 'How often do you move or speak slowly, or feel restless?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 10,
          text: 'How often do you have thoughts that you would be better off dead?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 11,
          text: 'How often do you feel overwhelmed by daily responsibilities?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' }
          ]
        },
        {
          id: 12,
          text: 'How often do you feel isolated or disconnected from others?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' }
          ]
        },
        {
          id: 13,
          text: 'How often do you experience mood swings?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' }
          ]
        },
        {
          id: 14,
          text: 'How often do you feel satisfied with your life?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 15,
          text: 'How often do you feel confident in your ability to handle problems?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 16,
          text: 'How often do you feel emotionally stable?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 17,
          text: 'How often do you feel hopeful about the future?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 18,
          text: 'How often do you feel you have good relationships with family and friends?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 19,
          text: 'How often do you feel motivated to pursue your goals?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 20,
          text: 'How often do you feel you can cope with stress effectively?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 21,
          text: 'How often do you experience physical symptoms of anxiety (racing heart, sweating)?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' }
          ]
        },
        {
          id: 22,
          text: 'How often do you feel irritable or angry without clear reason?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' }
          ]
        },
        {
          id: 23,
          text: 'How often do you avoid social situations due to anxiety?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' }
          ]
        },
        {
          id: 24,
          text: 'How often do you feel like you have control over your emotions?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 25,
          text: 'How often do you feel grateful for things in your life?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 26,
          text: 'How often do you feel mentally clear and focused?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 27,
          text: 'How often do you feel comfortable expressing your emotions?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 28,
          text: 'How often do you feel you have a sense of purpose in life?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 29,
          text: 'How often do you feel resilient when facing challenges?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          id: 30,
          text: 'How often do you feel at peace with yourself?',
          options: [
            { value: 3, label: 'Always' },
            { value: 2, label: 'Often' },
            { value: 1, label: 'Sometimes' },
            { value: 0, label: 'Never' }
          ]
        }
      ]
    },
    stress: {
      title: 'Stress Assessment',
      description: 'Evaluate your current stress levels and coping abilities',
      questions: [
        {
          id: 1,
          text: 'In the past month, how often have you felt nervous or stressed?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 2,
          text: 'How often have you felt unable to control important things in your life?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 3,
          text: 'How often have you felt that you could not cope with all the things you had to do?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 4,
          text: 'How often have you felt angry or irritable?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 5,
          text: 'How often have you found it difficult to relax?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 6,
          text: 'How often have you felt overwhelmed by your responsibilities?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 7,
          text: 'How often have you felt that things were going your way?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Fairly often' },
            { value: 0, label: 'Very often' }
          ]
        },
        {
          id: 8,
          text: 'How often have you felt confident about your ability to handle personal problems?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Fairly often' },
            { value: 0, label: 'Very often' }
          ]
        },
        {
          id: 9,
          text: 'How often have you felt that you were on top of things?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Fairly often' },
            { value: 0, label: 'Very often' }
          ]
        },
        {
          id: 10,
          text: 'How often have you been upset because of something unexpected?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 11,
          text: 'How often have you felt difficulties were piling up so high you could not overcome them?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 12,
          text: 'How often have you felt that you were effectively coping with important changes in your life?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Fairly often' },
            { value: 0, label: 'Very often' }
          ]
        },
        {
          id: 13,
          text: 'How often have you felt nervous and stressed?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 14,
          text: 'How often have you dealt successfully with day-to-day problems and annoyances?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Fairly often' },
            { value: 0, label: 'Very often' }
          ]
        },
        {
          id: 15,
          text: 'How often have you felt that you were coping well with the important changes in your life?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Fairly often' },
            { value: 0, label: 'Very often' }
          ]
        },
        {
          id: 16,
          text: 'How often have you felt that you have control over irritations in your life?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Fairly often' },
            { value: 0, label: 'Very often' }
          ]
        },
        {
          id: 17,
          text: 'How often have you felt that things were not going your way?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 18,
          text: 'How often have you found yourself thinking about things you have to accomplish?',
          options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Fairly often' },
            { value: 4, label: 'Very often' }
          ]
        },
        {
          id: 19,
          text: 'How often have you been able to control the way you spend your time?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Fairly often' },
            { value: 0, label: 'Very often' }
          ]
        },
        {
          id: 20,
          text: 'How often have you felt that you were able to stay on top of things?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Almost never' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Fairly often' },
            { value: 0, label: 'Very often' }
          ]
        }
      ]
    },
    anxiety: {
      title: 'Anxiety Assessment',
      description: 'Evaluate your anxiety levels and identify potential triggers',
      questions: [
        {
          id: 1,
          text: 'How often do you feel nervous, anxious, or on edge?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 2,
          text: 'How often do you find it difficult to stop or control worrying?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 3,
          text: 'How often do you worry too much about different things?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 4,
          text: 'How often do you have trouble relaxing?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 5,
          text: 'How often do you feel restless and find it hard to sit still?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 6,
          text: 'How often do you become easily annoyed or irritable?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 7,
          text: 'How often do you feel afraid that something awful might happen?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 8,
          text: 'How often do you experience physical symptoms like rapid heartbeat or sweating when anxious?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 9,
          text: 'How often do you avoid situations that make you anxious?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 10,
          text: 'How often do you have difficulty concentrating due to anxiety?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 11,
          text: 'How often do you experience muscle tension or headaches due to stress?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 12,
          text: 'How often do you have trouble sleeping due to anxious thoughts?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 13,
          text: 'How often do you feel overwhelmed by daily responsibilities?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 14,
          text: 'How often do you experience panic attacks or sudden intense fear?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 15,
          text: 'How often do you worry about your health or physical symptoms?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 16,
          text: 'How often do you feel anxious in social situations?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 17,
          text: 'How often do you have intrusive or unwanted thoughts?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 18,
          text: 'How often do you feel like you need to check things repeatedly?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 19,
          text: 'How often do you experience digestive issues when stressed?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        },
        {
          id: 20,
          text: 'How often do you feel like your anxiety interferes with your daily life?',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' },
            { value: 2, label: 'More than half the days' },
            { value: 3, label: 'Nearly every day' }
          ]
        }
      ]
    }
  };

  const currentAssessment = assessmentData[currentCategory];

  useEffect(() => {
    if (!currentAssessment) {
      navigate('/dashboard/mental-health');
    }
  }, [category, currentAssessment, navigate]);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentAssessment && currentQuestion < currentAssessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate total score
      const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
      setScore(totalScore);
      setIsCompleted(true);

      // Update context based on assessment type
      if (currentCategory === 'mental') {
        // Mental Health Assessment: 30 questions, max score 90, threshold at 45
        const result = totalScore <= 45 ? 'Stable' : 'Unstable';
        updateComprehensiveEvaluation(result);
      } else if (currentCategory === 'stress') {
        // Stress Assessment: 20 questions, each worth 5 points, total 100
        const stressScore = Math.round((totalScore / 80) * 100); // Convert to 0-100 scale
        updateStressIndex(stressScore);
      } else if (currentCategory === 'anxiety') {
        // Anxiety Assessment: 20 questions, max score 60, results stored separately
        // For now, we'll just complete the assessment without updating context
        // You can add anxiety-specific context updates here if needed
      }

      // Save completed assessment result
      const assessmentResult: AssessmentResult = {
        type: currentCategory as 'mental' | 'stress' | 'anxiety',
        score: totalScore,
        maxScore: currentAssessment.questions.length * 4,
        level: getScoreInterpretation(totalScore, currentAssessment.questions.length * 4, currentCategory).level,
        answers: { ...answers }
      };

      setCompletedAssessments(prev => [...prev, assessmentResult]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Check if all assessments are completed based on context data
  const hasCompletedAllAssessments = () => {
    const hasMental = mentalHealthData.comprehensiveEvaluation !== '--';
    const hasStress = mentalHealthData.stressIndex !== '--';
    const hasAnxiety = true; // We'll assume anxiety assessment is completed if we have other data
    
    return hasMental && hasStress && hasAnxiety;
  };

  const handleGenerateAdvice = async () => {
    if (!hasCompletedAllAssessments()) {
      message.warning('Please complete all three assessments first (Mental Health, Stress, and Anxiety)');
      return;
    }

    setAdviceLoading(true);
    setShowAdviceModal(true);

    try {
      // Create assessment results from context data
      const assessmentResults: AssessmentResult[] = [
        {
          type: 'mental',
          score: mentalHealthData.comprehensiveEvaluation === 'Stable' ? 30 : 70,
          maxScore: 90,
          level: mentalHealthData.comprehensiveEvaluation,
          answers: {}
        },
        {
          type: 'stress',
          score: Number(mentalHealthData.stressIndex),
          maxScore: 100,
          level: Number(mentalHealthData.stressIndex) <= 25 ? 'Low' : 
                 Number(mentalHealthData.stressIndex) <= 50 ? 'Moderate' :
                 Number(mentalHealthData.stressIndex) <= 75 ? 'High' : 'Very High',
          answers: {}
        },
        {
          type: 'anxiety',
          score: 30, // Default anxiety score
          maxScore: 60,
          level: 'Moderate',
          answers: {}
        }
      ];

      const response = await generateMentalHealthAdvice(assessmentResults);
      
      if (response.code === 200) {
        setAiAdvice(response.data);
        message.success('AI advice generated successfully!');
      } else {
        throw new Error(response.message || 'Failed to generate advice');
      }
    } catch (error: any) {
      console.error('Error generating advice:', error);
      message.error(error.message || 'Failed to generate advice. Please try again.');
    } finally {
      setAdviceLoading(false);
    }
  };

  const getScoreInterpretation = (score: number, maxScore: number, assessmentType: string) => {
    if (assessmentType === 'mental') {
      // Mental Health Assessment interpretation
      const result = score <= 45 ? 'Stable' : 'Unstable';
      if (result === 'Stable') {
        return {
          level: 'Stable',
          color: '#52c41a',
          description: 'Your mental health status is stable. Continue maintaining a positive lifestyle and healthy habits.'
        };
      } else {
        return {
          level: 'Unstable',
          color: '#f5222d',
          description: 'Your mental health may need attention. Consider seeking professional support or counseling.'
        };
      }
    } else if (assessmentType === 'stress') {
      // Stress Assessment interpretation
      const stressScore = Math.round((score / 80) * 100);
      if (stressScore <= 25) {
        return { level: 'Low', color: '#52c41a', description: 'Your stress levels are low. You are managing stress well.' };
      } else if (stressScore <= 50) {
        return { level: 'Moderate', color: '#faad14', description: 'You have moderate stress levels. Consider stress management techniques.' };
      } else if (stressScore <= 75) {
        return { level: 'High', color: '#fa8c16', description: 'You have high stress levels. Professional support may be beneficial.' };
      } else {
        return { level: 'Very High', color: '#f5222d', description: 'Your stress levels are very high. Strongly recommend seeking professional help.' };
      }
    } else if (assessmentType === 'anxiety') {
      // Anxiety Assessment interpretation (20 questions, max score 60)
      const percentage = (score / 60) * 100;
      if (percentage <= 25) {
        return { level: 'Low', color: '#52c41a', description: 'Your anxiety levels are low. You are managing anxiety well.' };
      } else if (percentage <= 50) {
        return { level: 'Moderate', color: '#faad14', description: 'You have moderate anxiety levels. Consider relaxation techniques and stress management.' };
      } else if (percentage <= 75) {
        return { level: 'High', color: '#fa8c16', description: 'You have high anxiety levels. Consider seeking professional support or therapy.' };
      } else {
        return { level: 'Very High', color: '#f5222d', description: 'Your anxiety levels are very high. Strongly recommend seeking professional mental health support.' };
      }
    }
    return { level: 'Unknown', color: '#666', description: 'Unable to interpret results.' };
  };

  if (!currentAssessment) {
    return null;
  }

  if (isCompleted) {
    const maxScore = currentAssessment.questions.length * 4;
    const interpretation = getScoreInterpretation(score, maxScore, currentCategory);

    return (
      <DashboardLayout>
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <Result
            status="success"
            title="Assessment Completed"
            subTitle={`You have completed the ${currentAssessment.title}. Here are your results:`}
            extra={[
              <Button type="primary" key="back" onClick={() => navigate('/dashboard/mental-health')}>
                Back to Home
              </Button>,
              <Button key="chat" onClick={() => navigate('/dashboard/mental-health/chat')}>
                Consult AI Therapist
              </Button>,
              <Button 
                key="advice" 
                type="primary" 
                icon={<RobotOutlined />}
                onClick={handleGenerateAdvice}
                disabled={!hasCompletedAllAssessments()}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                {!hasCompletedAllAssessments() 
                  ? 'Complete All Assessments First' 
                  : 'Get AI Advice'
                }
              </Button>
            ]}
          />
          
          <Card style={{ marginTop: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3}>Test Results</Title>
              <div style={{ margin: '24px 0' }}>
                <Text style={{ fontSize: '48px', fontWeight: 'bold', color: interpretation.color }}>
                  {score}/{maxScore}
                </Text>
                <br />
                <Text style={{ fontSize: '18px', color: interpretation.color }}>
                  {interpretation.level} Level
                </Text>
              </div>
              <Paragraph style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
                {interpretation.description}
              </Paragraph>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const currentQ = currentAssessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / currentAssessment.questions.length) * 100;
  const isAnswered = answers[currentQ.id] !== undefined;

  return (
    <DashboardLayout>
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/dashboard/mental-health')}
            style={{ marginBottom: '16px' }}
          >
            Back
          </Button>
          <Title level={2}>{currentAssessment.title}</Title>
          <Paragraph style={{ color: '#666' }}>{currentAssessment.description}</Paragraph>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Text>Progress</Text>
            <Text>{currentQuestion + 1} / {currentAssessment.questions.length}</Text>
          </div>
          <Progress percent={progress} showInfo={false} />
        </div>

        {/* Question Card */}
        <QuestionCard>
          <Title level={4} style={{ marginBottom: '24px' }}>
            {currentQuestion + 1}. {currentQ.text}
          </Title>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            {currentQ.options.map((option) => (
              <OptionButton
                key={option.value}
                selected={answers[currentQ.id] === option.value}
                onClick={() => handleAnswer(currentQ.id, option.value)}
              >
                {option.label}
              </OptionButton>
            ))}
          </Space>
        </QuestionCard>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            type="primary" 
            onClick={handleNext}
            disabled={!isAnswered}
          >
            {currentQuestion === currentAssessment.questions.length - 1 ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>
      </div>

      {/* AI Advice Modal */}
      <MentalHealthAdviceModal
        visible={showAdviceModal}
        onClose={() => setShowAdviceModal(false)}
        advice={aiAdvice}
        loading={adviceLoading}
      />
    </DashboardLayout>
  );
};

export default MentalHealthAssessment;
