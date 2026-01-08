/**
 * KWIZ Internationalization (i18n)
 * Translations for all supported languages
 */

import { Language } from '@/store';

// Translation keys organized by section
export interface Translations {
    // Common
    common: {
        back: string;
        cancel: string;
        save: string;
        delete: string;
        edit: string;
        confirm: string;
        loading: string;
        error: string;
        success: string;
        ok: string;
        yes: string;
        no: string;
    };

    // Navigation
    nav: {
        home: string;
        profile: string;
        settings: string;
        leaderboard: string;
    };

    // Home Screen
    home: {
        welcome: string;
        tagline: string;
        joinQuiz: string;
        createQuiz: string;
        enterCode: string;
        leaderboard: string;
        scanQr: string;
        orEnterCode: string;
    };

    // Join Quiz
    join: {
        title: string;
        enterCode: string;
        codePlaceholder: string;
        joinButton: string;
        noQuizFound: string;
        joining: string;
    };

    // Create Quiz
    create: {
        title: string;
        quizTitle: string;
        quizTitlePlaceholder: string;
        addQuestion: string;
        publish: string;
        unpublish: string;
        host: string;
        share: string;
        questions: string;
        noQuestions: string;
        addFirstQuestion: string;
        generateWithAi: string;
        aiBulk: string;
        // My Quizzes
        myQuizzesTitle: string;
        noQuizzesYet: string;
        createFirstQuiz: string;
        createYourFirstQuiz: string;
        creatorAccessRequired: string;
        creatorAccessDescription: string;
        goToProfile: string;
        edit: string;
        copy: string;
        delete: string;
        deleteQuiz: string;
        deleteConfirm: string;
        // Status labels
        draft: string;
        published: string;
        finished: string;
        // Question editing
        questionText: string;
        options: string;
        correctAnswer: string;
        timeLimit: string;
        pointValue: string;
        saveQuestion: string;
        // QR Scanner
        scanQrCode: string;
        pointCamera: string;
        cameraPermission: string;
        cameraAccessDesc: string;
        allowCamera: string;
        enterManually: string;
        invalidQrCode: string;
        invalidQrCodeMsg: string;
        tapToScan: string;
        flash: string;
        close: string;
        loading: string;
    };

    // Quiz Play
    quiz: {
        question: string;
        of: string;
        timeLeft: string;
        submit: string;
        next: string;
        finish: string;
        correct: string;
        incorrect: string;
        points: string;
        streak: string;
        waiting: string;
        starting: string;
        ended: string;
        quizCode: string;
        leave: string;
        hostedBy: string;
        questions: string;
        players: string;
        waitingForHost: string;
    };

    // Leaderboard
    leaderboard: {
        title: string;
        thisQuiz: string;
        weekly: string;
        allTime: string;
        noRankings: string;
        playToSee: string;
        joinQuiz: string;
        rank: string;
        score: string;
        you: string;
    };

    // Profile
    profile: {
        title: string;
        myQuizzes: string;
        achievements: string;
        stats: string;
        quizzesPlayed: string;
        quizzesCreated: string;
        totalScore: string;
        winRate: string;
        displayName: string;
        changeName: string;
        changeAvatar: string;
        editProfile: string;
        level: string;
        xpToNextLevel: string;
        creatorTools: string;
        manageQuizzes: string;
        chooseAvatar: string;
        joiningAs: string;
        enterCodeHint: string;
        connecting: string;
    };

    // Settings
    settings: {
        title: string;
        language: string;
        appLanguage: string;
        appearance: string;
        colorTheme: string;
        aiProviders: string;
        aiProvidersHint: string;
        about: string;
        version: string;
        proMember: string;
        proFeatures: string;
        apiKeyRequired: string;
        addKey: string;
        savedKey: string;
        notSet: string;
        supportedModels: string;
        aboutApp: string;
    };

    // Themes
    themes: {
        warmBrown: string;
        oceanNight: string;
        forest: string;
        purpleNight: string;
        sunset: string;
    };

    // Errors & Alerts
    alerts: {
        publishFirst: string;
        publishFirstMessage: string;
        quizNotFound: string;
        connectionError: string;
        invalidCode: string;
        incompleteQuestions: string;
        quizPublished: string;
        quizLive: string;
        copied: string;
    };

    // Features
    features: {
        liveQuizzes: string;
        liveQuizzesDesc: string;
        aiQuestions: string;
        aiQuestionsDesc: string;
        instantFeedback: string;
        instantFeedbackDesc: string;
        leaderboards: string;
        leaderboardsDesc: string;
        realTimeQuiz: string;
        realTimeQuizDesc: string;
        qrCodeJoin: string;
        qrCodeJoinDesc: string;
        globalPlayers: string;
        globalPlayersDesc: string;
        customQuestions: string;
        customQuestionsDesc: string;
        rewardsRankings: string;
        rewardsRankingsDesc: string;
        multipleCategories: string;
        multipleCategoriesDesc: string;
        hostControls: string;
        hostControlsDesc: string;
        aiGenerator: string;
        aiGeneratorDesc: string;
        guestMode: string;
        guestModeDesc: string;
    };
}

// English translations (default)
const en: Translations = {
    common: {
        back: 'Back',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        confirm: 'Confirm',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        ok: 'OK',
        yes: 'Yes',
        no: 'No',
    },
    nav: {
        home: 'Home',
        profile: 'Profile',
        settings: 'Settings',
        leaderboard: 'Leaderboard',
    },
    home: {
        welcome: 'Welcome to KWIZ',
        tagline: 'Create & Play Interactive Quizzes',
        joinQuiz: 'Join Quiz',
        createQuiz: 'Create Quiz',
        enterCode: 'Enter Code',
        leaderboard: 'Leaderboard',
        scanQr: 'Scan QR Code',
        orEnterCode: 'or enter code manually',
    },
    join: {
        title: 'Join Quiz',
        enterCode: 'Enter quiz code',
        codePlaceholder: 'ABCD12',
        joinButton: 'Join',
        noQuizFound: 'No quiz found with this code',
        joining: 'Joining...',
    },
    create: {
        title: 'Create Quiz',
        quizTitle: 'Quiz Title',
        quizTitlePlaceholder: 'Enter quiz title...',
        addQuestion: 'Add Question',
        publish: 'Publish',
        unpublish: 'Unpublish',
        host: 'Host',
        share: 'Share',
        questions: 'Questions',
        noQuestions: 'No questions yet',
        addFirstQuestion: 'Add your first question to get started',
        generateWithAi: 'Generate with AI',
        aiBulk: 'AI Bulk',
        // My Quizzes
        myQuizzesTitle: 'My Quizzes',
        noQuizzesYet: 'No Quizzes Yet',
        createFirstQuiz: 'Create your first quiz and share it with players around the world!',
        createYourFirstQuiz: 'Create Your First Quiz',
        creatorAccessRequired: 'Creator Access Required',
        creatorAccessDescription: 'You need Creator permissions to create quizzes. Request access from your profile.',
        goToProfile: 'Go to Profile',
        edit: 'Edit',
        copy: 'Copy',
        delete: 'Delete',
        deleteQuiz: 'Delete Quiz',
        deleteConfirm: 'Are you sure you want to delete this quiz? This action cannot be undone.',
        // Status labels
        draft: 'Draft',
        published: 'Published',
        finished: 'Finished',
        // Question editing
        questionText: 'Question Text',
        options: 'Options',
        correctAnswer: 'Correct Answer',
        timeLimit: 'Time Limit',
        pointValue: 'Point Value',
        saveQuestion: 'Save Question',
        // QR Scanner
        scanQrCode: 'Scan QR Code',
        pointCamera: 'Point your camera at the quiz QR code',
        cameraPermission: 'Camera Permission',
        cameraAccessDesc: 'We need camera access to scan QR codes and join quizzes.',
        allowCamera: 'Allow Camera Access',
        enterManually: 'Enter Code Manually',
        invalidQrCode: 'Invalid QR Code',
        invalidQrCodeMsg: "This QR code doesn't appear to be a valid quiz code. Please try again.",
        tapToScan: 'Tap to scan again',
        flash: 'Flash',
        close: 'Close',
        loading: 'Loading...',
    },
    quiz: {
        question: 'Question',
        of: 'of',
        timeLeft: 'Time Left',
        submit: 'Submit',
        next: 'Next',
        finish: 'Finish',
        correct: 'Correct!',
        incorrect: 'Incorrect',
        points: 'points',
        streak: 'streak',
        waiting: 'Waiting for host...',
        starting: 'Starting...',
        ended: 'Quiz Ended',
        quizCode: 'Quiz Code',
        leave: 'Leave',
        hostedBy: 'Hosted by',
        questions: 'Questions',
        players: 'Players',
        waitingForHost: 'Waiting for the host to start the quiz...',
    },
    leaderboard: {
        title: 'Leaderboard',
        thisQuiz: 'This Quiz',
        weekly: 'Weekly',
        allTime: 'All Time',
        noRankings: 'No Rankings Yet',
        playToSee: 'Play a quiz to see the leaderboard!',
        joinQuiz: 'Join a Quiz',
        rank: 'Rank',
        score: 'Score',
        you: 'You',
    },
    profile: {
        title: 'Profile',
        myQuizzes: 'My Quizzes',
        achievements: 'Achievements',
        stats: 'Statistics',
        quizzesPlayed: 'Quizzes Played',
        quizzesCreated: 'Quizzes Created',
        totalScore: 'Total Score',
        winRate: 'Win Rate',
        displayName: 'Display Name',
        changeName: 'Change Name',
        changeAvatar: 'Change Avatar',
        editProfile: 'Edit Profile',
        level: 'Level',
        xpToNextLevel: 'XP to Next Level',
        creatorTools: 'Creator Tools',
        manageQuizzes: 'Create and manage your quizzes',
        chooseAvatar: 'Choose Avatar',
        joiningAs: 'Joining as',
        enterCodeHint: 'Enter the 6-digit quiz code to join',
        connecting: 'Connecting to server...',
    },
    settings: {
        title: 'Settings',
        language: 'Language',
        appLanguage: 'App Language',
        appearance: 'Appearance',
        colorTheme: 'Color Theme',
        aiProviders: 'AI Providers',
        aiProvidersHint: 'Configure API keys to use different AI models for question generation',
        about: 'About',
        version: 'Version',
        proMember: 'Pro Member',
        proFeatures: 'You have access to all premium features',
        apiKeyRequired: 'API Key Required',
        addKey: 'Add Key',
        savedKey: 'API key has been saved',
        notSet: 'Not set',
        supportedModels: 'Supported models',
        aboutApp: 'KWIZ is a real-time multiplayer quiz platform. Create custom quizzes, host live game sessions, and compete with friends using AI-powered question generation.',
    },
    themes: {
        warmBrown: 'Warm Brown',
        oceanNight: 'Ocean Night',
        forest: 'Forest',
        purpleNight: 'Purple Night',
        sunset: 'Sunset',
    },
    alerts: {
        publishFirst: 'Publish First',
        publishFirstMessage: 'Please publish your quiz before hosting.',
        quizNotFound: 'Quiz not found',
        connectionError: 'Connection error. Please check your internet.',
        invalidCode: 'Invalid quiz code',
        incompleteQuestions: 'Please complete all questions before publishing',
        quizPublished: 'Quiz Published!',
        quizLive: 'Quiz is Live!',
        copied: 'Copied to clipboard!',
    },
    features: {
        liveQuizzes: 'Live Quizzes',
        liveQuizzesDesc: 'Host real-time quizzes with friends',
        aiQuestions: 'AI Questions',
        aiQuestionsDesc: 'Generate questions instantly with AI',
        instantFeedback: 'Instant Feedback',
        instantFeedbackDesc: 'See results in real-time',
        leaderboards: 'Leaderboards',
        leaderboardsDesc: 'Compete and track rankings',
        realTimeQuiz: 'Real-Time Quiz',
        realTimeQuizDesc: 'Live multiplayer quizzes with instant scoring and leaderboards',
        qrCodeJoin: 'QR Code Join',
        qrCodeJoinDesc: 'Scan to join instantly - no typing, no hassle',
        globalPlayers: 'Global Players',
        globalPlayersDesc: 'Compete with players from around the world in real-time',
        customQuestions: 'Custom Questions',
        customQuestionsDesc: 'Create your own quizzes with unlimited questions',
        rewardsRankings: 'Rewards & Rankings',
        rewardsRankingsDesc: 'Earn XP, unlock badges, and climb the leaderboard',
        multipleCategories: 'Multiple Categories',
        multipleCategoriesDesc: 'Education, entertainment, trivia, sports & more',
        hostControls: 'Host Controls',
        hostControlsDesc: 'Auto-advance or manual control - you decide',
        aiGenerator: 'AI Quiz Generator',
        aiGeneratorDesc: 'Let AI create questions on any topic instantly',
        guestMode: 'Guest Mode',
        guestModeDesc: 'Join without registration - play instantly',
    },
};

// German translations
const de: Translations = {
    common: {
        back: 'Zurück',
        cancel: 'Abbrechen',
        save: 'Speichern',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        confirm: 'Bestätigen',
        loading: 'Laden...',
        error: 'Fehler',
        success: 'Erfolg',
        ok: 'OK',
        yes: 'Ja',
        no: 'Nein',
    },
    nav: {
        home: 'Start',
        profile: 'Profil',
        settings: 'Einstellungen',
        leaderboard: 'Rangliste',
    },
    home: {
        welcome: 'Willkommen bei KWIZ',
        tagline: 'Erstelle & Spiele interaktive Quizze',
        joinQuiz: 'Quiz beitreten',
        createQuiz: 'Quiz erstellen',
        enterCode: 'Code eingeben',
        leaderboard: 'Rangliste',
        scanQr: 'QR-Code scannen',
        orEnterCode: 'oder Code manuell eingeben',
    },
    join: {
        title: 'Quiz beitreten',
        enterCode: 'Quiz-Code eingeben',
        codePlaceholder: 'ABCD12',
        joinButton: 'Beitreten',
        noQuizFound: 'Kein Quiz mit diesem Code gefunden',
        joining: 'Beitreten...',
    },
    create: {
        title: 'Quiz erstellen',
        quizTitle: 'Quiz-Titel',
        quizTitlePlaceholder: 'Quiz-Titel eingeben...',
        addQuestion: 'Frage hinzufügen',
        publish: 'Veröffentlichen',
        unpublish: 'Zurückziehen',
        host: 'Hosten',
        share: 'Teilen',
        questions: 'Fragen',
        noQuestions: 'Noch keine Fragen',
        addFirstQuestion: 'Füge deine erste Frage hinzu',
        generateWithAi: 'Mit KI generieren',
        aiBulk: 'KI Masse',
        myQuizzesTitle: 'Meine Quizze',
        noQuizzesYet: 'Noch keine Quizze',
        createFirstQuiz: 'Erstelle dein erstes Quiz und teile es mit Spielern auf der ganzen Welt!',
        createYourFirstQuiz: 'Erstelle dein erstes Quiz',
        creatorAccessRequired: 'Creator-Zugang erforderlich',
        creatorAccessDescription: 'Du benötigst Creator-Berechtigungen. Fordere Zugang in deinem Profil an.',
        goToProfile: 'Zum Profil',
        edit: 'Bearbeiten',
        copy: 'Kopieren',
        delete: 'Löschen',
        deleteQuiz: 'Quiz löschen',
        deleteConfirm: 'Möchtest du dieses Quiz wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
        draft: 'Entwurf',
        published: 'Veröffentlicht',
        finished: 'Beendet',
        questionText: 'Fragetext',
        options: 'Optionen',
        correctAnswer: 'Richtige Antwort',
        timeLimit: 'Zeitlimit',
        pointValue: 'Punktwert',
        saveQuestion: 'Frage speichern',
        scanQrCode: 'QR-Code scannen',
        pointCamera: 'Richte deine Kamera auf den Quiz-QR-Code',
        cameraPermission: 'Kameraberechtigung',
        cameraAccessDesc: 'Wir benötigen Kamerazugriff zum Scannen von QR-Codes.',
        allowCamera: 'Kamerazugriff erlauben',
        enterManually: 'Code manuell eingeben',
        invalidQrCode: 'Ungültiger QR-Code',
        invalidQrCodeMsg: 'Dieser QR-Code scheint kein gültiger Quiz-Code zu sein. Bitte versuche es erneut.',
        tapToScan: 'Tippe zum erneuten Scannen',
        flash: 'Blitz',
        close: 'Schließen',
        loading: 'Lädt...',
    },
    quiz: {
        question: 'Frage',
        of: 'von',
        timeLeft: 'Zeit übrig',
        submit: 'Absenden',
        next: 'Weiter',
        finish: 'Beenden',
        correct: 'Richtig!',
        incorrect: 'Falsch',
        points: 'Punkte',
        streak: 'Serie',
        waiting: 'Warte auf Host...',
        starting: 'Startet...',
        ended: 'Quiz beendet',
        quizCode: 'Quiz-Code',
        leave: 'Verlassen',
        hostedBy: 'Gehostet von',
        questions: 'Fragen',
        players: 'Spieler',
        waitingForHost: 'Warte auf den Host zum Starten...',
    },
    leaderboard: {
        title: 'Rangliste',
        thisQuiz: 'Dieses Quiz',
        weekly: 'Wöchentlich',
        allTime: 'Allzeit',
        noRankings: 'Noch keine Platzierungen',
        playToSee: 'Spiele ein Quiz, um die Rangliste zu sehen!',
        joinQuiz: 'Quiz beitreten',
        rank: 'Rang',
        score: 'Punkte',
        you: 'Du',
    },
    profile: {
        title: 'Profil',
        myQuizzes: 'Meine Quizze',
        achievements: 'Erfolge',
        stats: 'Statistiken',
        quizzesPlayed: 'Gespielte Quizze',
        quizzesCreated: 'Erstellte Quizze',
        totalScore: 'Gesamtpunktzahl',
        winRate: 'Gewinnrate',
        displayName: 'Anzeigename',
        changeName: 'Name ändern',
        changeAvatar: 'Avatar ändern',
        editProfile: 'Profil bearbeiten',
        level: 'Level',
        xpToNextLevel: 'XP bis zum nächsten Level',
        creatorTools: 'Creator-Tools',
        manageQuizzes: 'Erstelle und verwalte deine Quizze',
        chooseAvatar: 'Avatar wählen',
        joiningAs: 'Beitreten als',
        enterCodeHint: 'Gib den 6-stelligen Quiz-Code ein',
        connecting: 'Verbindung zum Server...',
    },
    settings: {
        title: 'Einstellungen',
        language: 'Sprache',
        appLanguage: 'App-Sprache',
        appearance: 'Erscheinungsbild',
        colorTheme: 'Farbthema',
        aiProviders: 'KI-Anbieter',
        aiProvidersHint: 'API-Schlüssel für verschiedene KI-Modelle zur Fragengenerierung konfigurieren',
        about: 'Über',
        version: 'Version',
        proMember: 'Pro-Mitglied',
        proFeatures: 'Du hast Zugang zu allen Premium-Funktionen',
        apiKeyRequired: 'API-Schlüssel erforderlich',
        addKey: 'Schlüssel hinzufügen',
        savedKey: 'API-Schlüssel wurde gespeichert',
        notSet: 'Nicht festgelegt',
        supportedModels: 'Unterstützte Modelle',
        aboutApp: 'KWIZ ist eine Echtzeit-Multiplayer-Quiz-Plattform. Erstelle eigene Quizze, hoste Live-Spielsitzungen und trete mit KI-generierter Fragenerstellung gegen Freunde an.',
    },
    themes: {
        warmBrown: 'Warmes Braun',
        oceanNight: 'Ozean Nacht',
        forest: 'Wald',
        purpleNight: 'Lila Nacht',
        sunset: 'Sonnenuntergang',
    },
    alerts: {
        publishFirst: 'Zuerst veröffentlichen',
        publishFirstMessage: 'Bitte veröffentliche dein Quiz vor dem Hosten.',
        quizNotFound: 'Quiz nicht gefunden',
        connectionError: 'Verbindungsfehler. Bitte überprüfe deine Internetverbindung.',
        invalidCode: 'Ungültiger Quiz-Code',
        incompleteQuestions: 'Bitte vervollständige alle Fragen vor dem Veröffentlichen',
        quizPublished: 'Quiz veröffentlicht!',
        quizLive: 'Quiz ist live!',
        copied: 'In die Zwischenablage kopiert!',
    },
    features: {
        liveQuizzes: 'Live-Quizze',
        liveQuizzesDesc: 'Echtzeit-Quizze mit Freunden hosten',
        aiQuestions: 'KI-Fragen',
        aiQuestionsDesc: 'Fragen sofort mit KI generieren',
        instantFeedback: 'Sofortiges Feedback',
        instantFeedbackDesc: 'Ergebnisse in Echtzeit sehen',
        leaderboards: 'Ranglisten',
        leaderboardsDesc: 'Konkurrieren und Platzierungen verfolgen',
        realTimeQuiz: 'Echtzeit-Quiz',
        realTimeQuizDesc: 'Live-Multiplayer-Quizze mit sofortiger Punktevergabe',
        qrCodeJoin: 'QR-Code beitreten',
        qrCodeJoinDesc: 'Scannen zum sofortigen Beitreten - kein Tippen',
        globalPlayers: 'Globale Spieler',
        globalPlayersDesc: 'Trete gegen Spieler aus aller Welt an',
        customQuestions: 'Eigene Fragen',
        customQuestionsDesc: 'Erstelle eigene Quizze mit unbegrenzten Fragen',
        rewardsRankings: 'Belohnungen & Rankings',
        rewardsRankingsDesc: 'Verdiene XP, schalte Abzeichen frei und klettere die Rangliste hoch',
        multipleCategories: 'Mehrere Kategorien',
        multipleCategoriesDesc: 'Bildung, Unterhaltung, Trivia, Sport & mehr',
        hostControls: 'Host-Steuerung',
        hostControlsDesc: 'Automatisch oder manuell - du entscheidest',
        aiGenerator: 'KI-Quiz-Generator',
        aiGeneratorDesc: 'Lass KI sofort Fragen zu jedem Thema erstellen',
        guestMode: 'Gastmodus',
        guestModeDesc: 'Ohne Registrierung beitreten - sofort spielen',
    },
};

// Spanish translations
const es: Translations = {
    common: {
        back: 'Atrás',
        cancel: 'Cancelar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        confirm: 'Confirmar',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        ok: 'OK',
        yes: 'Sí',
        no: 'No',
    },
    nav: {
        home: 'Inicio',
        profile: 'Perfil',
        settings: 'Ajustes',
        leaderboard: 'Clasificación',
    },
    home: {
        welcome: 'Bienvenido a KWIZ',
        tagline: 'Crea y Juega Quizzes Interactivos',
        joinQuiz: 'Unirse al Quiz',
        createQuiz: 'Crear Quiz',
        enterCode: 'Ingresar Código',
        leaderboard: 'Clasificación',
        scanQr: 'Escanear código QR',
        orEnterCode: 'o ingresa el código manualmente',
    },
    join: {
        title: 'Unirse al Quiz',
        enterCode: 'Ingresa el código del quiz',
        codePlaceholder: 'ABCD12',
        joinButton: 'Unirse',
        noQuizFound: 'No se encontró ningún quiz con este código',
        joining: 'Uniéndose...',
    },
    create: {
        title: 'Crear Quiz',
        quizTitle: 'Título del Quiz',
        quizTitlePlaceholder: 'Ingresa el título del quiz...',
        addQuestion: 'Agregar Pregunta',
        publish: 'Publicar',
        unpublish: 'Despublicar',
        host: 'Hospedar',
        share: 'Compartir',
        questions: 'Preguntas',
        noQuestions: 'Sin preguntas aún',
        addFirstQuestion: 'Agrega tu primera pregunta para comenzar',
        generateWithAi: 'Generar con IA',
        aiBulk: 'IA Masivo',
        myQuizzesTitle: 'Mis Quizzes',
        noQuizzesYet: 'Sin Quizzes Aún',
        createFirstQuiz: '¡Crea tu primer quiz y compártelo con jugadores de todo el mundo!',
        createYourFirstQuiz: 'Crea Tu Primer Quiz',
        creatorAccessRequired: 'Acceso de Creador Requerido',
        creatorAccessDescription: 'Necesitas permisos de Creador. Solicita acceso desde tu perfil.',
        goToProfile: 'Ir al Perfil',
        edit: 'Editar',
        copy: 'Copiar',
        delete: 'Eliminar',
        deleteQuiz: 'Eliminar Quiz',
        deleteConfirm: '¿Estás seguro de que quieres eliminar este quiz? Esta acción no se puede deshacer.',
        draft: 'Borrador',
        published: 'Publicado',
        finished: 'Finalizado',
        questionText: 'Texto de la Pregunta',
        options: 'Opciones',
        correctAnswer: 'Respuesta Correcta',
        timeLimit: 'Límite de Tiempo',
        pointValue: 'Valor en Puntos',
        saveQuestion: 'Guardar Pregunta',
        scanQrCode: 'Escanear Código QR',
        pointCamera: 'Apunta tu cámara al código QR del quiz',
        cameraPermission: 'Permiso de Cámara',
        cameraAccessDesc: 'Necesitamos acceso a la cámara para escanear códigos QR.',
        allowCamera: 'Permitir Acceso a Cámara',
        enterManually: 'Ingresar Código Manualmente',
        invalidQrCode: 'Código QR Inválido',
        invalidQrCodeMsg: 'Este código QR no parece ser un código de quiz válido. Inténtalo de nuevo.',
        tapToScan: 'Toca para escanear de nuevo',
        flash: 'Flash',
        close: 'Cerrar',
        loading: 'Cargando...',
    },
    quiz: {
        question: 'Pregunta',
        of: 'de',
        timeLeft: 'Tiempo restante',
        submit: 'Enviar',
        next: 'Siguiente',
        finish: 'Terminar',
        correct: '¡Correcto!',
        incorrect: 'Incorrecto',
        points: 'puntos',
        streak: 'racha',
        waiting: 'Esperando al anfitrión...',
        starting: 'Iniciando...',
        ended: 'Quiz Terminado',
        quizCode: 'Código del Quiz',
        leave: 'Salir',
        hostedBy: 'Hospedado por',
        questions: 'Preguntas',
        players: 'Jugadores',
        waitingForHost: 'Esperando a que el anfitrión inicie el quiz...',
    },
    leaderboard: {
        title: 'Clasificación',
        thisQuiz: 'Este Quiz',
        weekly: 'Semanal',
        allTime: 'Histórico',
        noRankings: 'Sin Clasificaciones Aún',
        playToSee: '¡Juega un quiz para ver la clasificación!',
        joinQuiz: 'Unirse a un Quiz',
        rank: 'Posición',
        score: 'Puntuación',
        you: 'Tú',
    },
    profile: {
        title: 'Perfil',
        myQuizzes: 'Mis Quizzes',
        achievements: 'Logros',
        stats: 'Estadísticas',
        quizzesPlayed: 'Quizzes Jugados',
        quizzesCreated: 'Quizzes Creados',
        totalScore: 'Puntuación Total',
        winRate: 'Tasa de Victoria',
        displayName: 'Nombre',
        changeName: 'Cambiar Nombre',
        changeAvatar: 'Cambiar Avatar',
        editProfile: 'Editar Perfil',
        level: 'Nivel',
        xpToNextLevel: 'XP para siguiente nivel',
        creatorTools: 'Herramientas de Creador',
        manageQuizzes: 'Crea y gestiona tus quizzes',
        chooseAvatar: 'Elegir Avatar',
        joiningAs: 'Uniéndose como',
        enterCodeHint: 'Ingresa el código de 6 dígitos',
        connecting: 'Conectando al servidor...',
    },
    settings: {
        title: 'Ajustes',
        language: 'Idioma',
        appLanguage: 'Idioma de la App',
        appearance: 'Apariencia',
        colorTheme: 'Tema de Color',
        aiProviders: 'Proveedores de IA',
        aiProvidersHint: 'Configura claves API para usar diferentes modelos de IA para generar preguntas',
        about: 'Acerca de',
        version: 'Versión',
        proMember: 'Miembro Pro',
        proFeatures: 'Tienes acceso a todas las funciones premium',
        apiKeyRequired: 'Se requiere clave API',
        addKey: 'Agregar Clave',
        savedKey: 'La clave API ha sido guardada',
        notSet: 'No configurado',
        supportedModels: 'Modelos soportados',
        aboutApp: 'KWIZ es una plataforma de quizzes multijugador en tiempo real. Crea quizzes personalizados, hospeda sesiones en vivo y compite con amigos usando generación de preguntas con IA.',
    },
    themes: {
        warmBrown: 'Marrón Cálido',
        oceanNight: 'Noche Oceánica',
        forest: 'Bosque',
        purpleNight: 'Noche Púrpura',
        sunset: 'Atardecer',
    },
    alerts: {
        publishFirst: 'Publicar Primero',
        publishFirstMessage: 'Por favor publica tu quiz antes de hospedarlo.',
        quizNotFound: 'Quiz no encontrado',
        connectionError: 'Error de conexión. Por favor verifica tu internet.',
        invalidCode: 'Código de quiz inválido',
        incompleteQuestions: 'Por favor completa todas las preguntas antes de publicar',
        quizPublished: '¡Quiz Publicado!',
        quizLive: '¡Quiz en Vivo!',
        copied: '¡Copiado al portapapeles!',
    },
    features: {
        liveQuizzes: 'Quizzes en Vivo',
        liveQuizzesDesc: 'Hospeda quizzes en tiempo real con amigos',
        aiQuestions: 'Preguntas IA',
        aiQuestionsDesc: 'Genera preguntas instantáneamente con IA',
        instantFeedback: 'Retroalimentación Instantánea',
        instantFeedbackDesc: 'Ve resultados en tiempo real',
        leaderboards: 'Clasificaciones',
        leaderboardsDesc: 'Compite y sigue las posiciones',
        realTimeQuiz: 'Quiz en Tiempo Real',
        realTimeQuizDesc: 'Quizzes multijugador con puntuación instantánea',
        qrCodeJoin: 'Únete con QR',
        qrCodeJoinDesc: 'Escanea para unirte al instante',
        globalPlayers: 'Jugadores Globales',
        globalPlayersDesc: 'Compite con jugadores de todo el mundo',
        customQuestions: 'Preguntas Personalizadas',
        customQuestionsDesc: 'Crea tus propios quizzes ilimitados',
        rewardsRankings: 'Recompensas y Rankings',
        rewardsRankingsDesc: 'Gana XP, desbloquea insignias y sube en el ranking',
        multipleCategories: 'Múltiples Categorías',
        multipleCategoriesDesc: 'Educación, entretenimiento, trivia, deportes y más',
        hostControls: 'Controles de Anfitrión',
        hostControlsDesc: 'Avance automático o manual - tú decides',
        aiGenerator: 'Generador IA de Quizzes',
        aiGeneratorDesc: 'Deja que la IA cree preguntas sobre cualquier tema',
        guestMode: 'Modo Invitado',
        guestModeDesc: 'Únete sin registro - juega al instante',
    },
};

// French translations
const fr: Translations = {
    common: {
        back: 'Retour',
        cancel: 'Annuler',
        save: 'Sauvegarder',
        delete: 'Supprimer',
        edit: 'Modifier',
        confirm: 'Confirmer',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        ok: 'OK',
        yes: 'Oui',
        no: 'Non',
    },
    nav: {
        home: 'Accueil',
        profile: 'Profil',
        settings: 'Paramètres',
        leaderboard: 'Classement',
    },
    home: {
        welcome: 'Bienvenue sur KWIZ',
        tagline: 'Créez et Jouez des Quiz Interactifs',
        joinQuiz: 'Rejoindre un Quiz',
        createQuiz: 'Créer un Quiz',
        enterCode: 'Entrer le Code',
        leaderboard: 'Classement',
        scanQr: 'Scanner le QR Code',
        orEnterCode: 'ou entrez le code manuellement',
    },
    join: {
        title: 'Rejoindre un Quiz',
        enterCode: 'Entrez le code du quiz',
        codePlaceholder: 'ABCD12',
        joinButton: 'Rejoindre',
        noQuizFound: 'Aucun quiz trouvé avec ce code',
        joining: 'Connexion...',
    },
    create: {
        title: 'Créer un Quiz',
        quizTitle: 'Titre du Quiz',
        quizTitlePlaceholder: 'Entrez le titre du quiz...',
        addQuestion: 'Ajouter une Question',
        publish: 'Publier',
        unpublish: 'Dépublier',
        host: 'Héberger',
        share: 'Partager',
        questions: 'Questions',
        noQuestions: 'Pas encore de questions',
        addFirstQuestion: 'Ajoutez votre première question pour commencer',
        generateWithAi: "Générer avec l'IA",
        aiBulk: 'IA en Masse',
        myQuizzesTitle: 'Mes Quiz',
        noQuizzesYet: 'Pas Encore de Quiz',
        createFirstQuiz: 'Créez votre premier quiz et partagez-le avec des joueurs du monde entier !',
        createYourFirstQuiz: 'Créez Votre Premier Quiz',
        creatorAccessRequired: 'Accès Créateur Requis',
        creatorAccessDescription: "Vous avez besoin des permissions Créateur. Demandez l'accès depuis votre profil.",
        goToProfile: 'Aller au Profil',
        edit: 'Modifier',
        copy: 'Copier',
        delete: 'Supprimer',
        deleteQuiz: 'Supprimer le Quiz',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible.',
        draft: 'Brouillon',
        published: 'Publié',
        finished: 'Terminé',
        questionText: 'Texte de la Question',
        options: 'Options',
        correctAnswer: 'Bonne Réponse',
        timeLimit: 'Limite de Temps',
        pointValue: 'Valeur en Points',
        saveQuestion: 'Enregistrer la Question',
        scanQrCode: 'Scanner le Code QR',
        pointCamera: 'Pointez votre caméra vers le code QR du quiz',
        cameraPermission: 'Permission Caméra',
        cameraAccessDesc: "Nous avons besoin de l'accès caméra pour scanner les codes QR.",
        allowCamera: "Autoriser l'Accès Caméra",
        enterManually: 'Entrer le Code Manuellement',
        invalidQrCode: 'Code QR Invalide',
        invalidQrCodeMsg: "Ce code QR ne semble pas être un code de quiz valide. Veuillez réessayer.",
        tapToScan: 'Appuyez pour scanner à nouveau',
        flash: 'Flash',
        close: 'Fermer',
        loading: 'Chargement...',
    },
    quiz: {
        question: 'Question',
        of: 'sur',
        timeLeft: 'Temps restant',
        submit: 'Soumettre',
        next: 'Suivant',
        finish: 'Terminer',
        correct: 'Correct !',
        incorrect: 'Incorrect',
        points: 'points',
        streak: 'série',
        waiting: "En attente de l'hôte...",
        starting: 'Démarrage...',
        ended: 'Quiz Terminé',
        quizCode: 'Code du Quiz',
        leave: 'Quitter',
        hostedBy: 'Hébergé par',
        questions: 'Questions',
        players: 'Joueurs',
        waitingForHost: "En attente du démarrage par l'hôte...",
    },
    leaderboard: {
        title: 'Classement',
        thisQuiz: 'Ce Quiz',
        weekly: 'Hebdomadaire',
        allTime: 'Tout Temps',
        noRankings: 'Pas Encore de Classement',
        playToSee: 'Jouez un quiz pour voir le classement !',
        joinQuiz: 'Rejoindre un Quiz',
        rank: 'Rang',
        score: 'Score',
        you: 'Vous',
    },
    profile: {
        title: 'Profil',
        myQuizzes: 'Mes Quiz',
        achievements: 'Réalisations',
        stats: 'Statistiques',
        quizzesPlayed: 'Quiz Joués',
        quizzesCreated: 'Quiz Créés',
        totalScore: 'Score Total',
        winRate: 'Taux de Victoire',
        displayName: 'Nom d\'affichage',
        changeName: 'Changer le Nom',
        changeAvatar: 'Changer l\'Avatar',
        editProfile: 'Modifier le Profil',
        level: 'Niveau',
        xpToNextLevel: 'XP pour niveau suivant',
        creatorTools: 'Outils Créateur',
        manageQuizzes: 'Créez et gérez vos quiz',
        chooseAvatar: 'Choisir Avatar',
        joiningAs: 'Rejoint en tant que',
        enterCodeHint: 'Entrez le code à 6 chiffres',
        connecting: 'Connexion au serveur...',
    },
    settings: {
        title: 'Paramètres',
        language: 'Langue',
        appLanguage: 'Langue de l\'Application',
        appearance: 'Apparence',
        colorTheme: 'Thème de Couleur',
        aiProviders: 'Fournisseurs d\'IA',
        aiProvidersHint: 'Configurez les clés API pour utiliser différents modèles d\'IA pour la génération de questions',
        about: 'À propos',
        version: 'Version',
        proMember: 'Membre Pro',
        proFeatures: 'Vous avez accès à toutes les fonctionnalités premium',
        apiKeyRequired: 'Clé API requise',
        addKey: 'Ajouter une Clé',
        savedKey: 'La clé API a été enregistrée',
        notSet: 'Non défini',
        supportedModels: 'Modèles supportés',
        aboutApp: 'KWIZ est une plateforme de quiz multijoueur en temps réel. Créez des quiz personnalisés, organisez des sessions en direct et affrontez vos amis avec des questions générées par l\'IA.',
    },
    themes: {
        warmBrown: 'Marron Chaud',
        oceanNight: 'Nuit Océanique',
        forest: 'Forêt',
        purpleNight: 'Nuit Pourpre',
        sunset: 'Coucher de Soleil',
    },
    alerts: {
        publishFirst: 'Publier d\'abord',
        publishFirstMessage: 'Veuillez publier votre quiz avant de l\'héberger.',
        quizNotFound: 'Quiz non trouvé',
        connectionError: 'Erreur de connexion. Veuillez vérifier votre internet.',
        invalidCode: 'Code de quiz invalide',
        incompleteQuestions: 'Veuillez compléter toutes les questions avant de publier',
        quizPublished: 'Quiz Publié !',
        quizLive: 'Quiz en Direct !',
        copied: 'Copié dans le presse-papiers !',
    },
    features: {
        liveQuizzes: 'Quiz en Direct',
        liveQuizzesDesc: 'Hébergez des quiz en temps réel avec des amis',
        aiQuestions: 'Questions IA',
        aiQuestionsDesc: 'Générez des questions instantanément avec l\'IA',
        instantFeedback: 'Retour Instantané',
        instantFeedbackDesc: 'Voyez les résultats en temps réel',
        leaderboards: 'Classements',
        leaderboardsDesc: 'Concourez et suivez les positions',
        realTimeQuiz: 'Quiz en Temps Réel',
        realTimeQuizDesc: 'Quiz multijoueur avec score instantané',
        qrCodeJoin: 'Rejoindre par QR',
        qrCodeJoinDesc: 'Scannez pour rejoindre instantanément',
        globalPlayers: 'Joueurs Mondiaux',
        globalPlayersDesc: 'Affrontez des joueurs du monde entier',
        customQuestions: 'Questions Personnalisées',
        customQuestionsDesc: 'Créez vos propres quiz illimités',
        rewardsRankings: 'Récompenses et Classements',
        rewardsRankingsDesc: 'Gagnez des XP, débloquez des badges',
        multipleCategories: 'Catégories Multiples',
        multipleCategoriesDesc: 'Éducation, divertissement, trivia, sport et plus',
        hostControls: 'Contrôles Hôte',
        hostControlsDesc: 'Avancement auto ou manuel - vous décidez',
        aiGenerator: 'Générateur IA de Quiz',
        aiGeneratorDesc: 'Laissez l\'IA créer des questions sur n\'importe quel sujet',
        guestMode: 'Mode Invité',
        guestModeDesc: 'Rejoignez sans inscription - jouez instantanément',
    },
};

// Italian translations
const it: Translations = {
    common: {
        back: 'Indietro',
        cancel: 'Annulla',
        save: 'Salva',
        delete: 'Elimina',
        edit: 'Modifica',
        confirm: 'Conferma',
        loading: 'Caricamento...',
        error: 'Errore',
        success: 'Successo',
        ok: 'OK',
        yes: 'Sì',
        no: 'No',
    },
    nav: {
        home: 'Home',
        profile: 'Profilo',
        settings: 'Impostazioni',
        leaderboard: 'Classifica',
    },
    home: {
        welcome: 'Benvenuto su KWIZ',
        tagline: 'Crea e Gioca Quiz Interattivi',
        joinQuiz: 'Unisciti al Quiz',
        createQuiz: 'Crea Quiz',
        enterCode: 'Inserisci Codice',
        leaderboard: 'Classifica',
        scanQr: 'Scansiona codice QR',
        orEnterCode: 'o inserisci il codice manualmente',
    },
    join: {
        title: 'Unisciti al Quiz',
        enterCode: 'Inserisci il codice del quiz',
        codePlaceholder: 'ABCD12',
        joinButton: 'Unisciti',
        noQuizFound: 'Nessun quiz trovato con questo codice',
        joining: 'Connessione...',
    },
    create: {
        title: 'Crea Quiz',
        quizTitle: 'Titolo del Quiz',
        quizTitlePlaceholder: 'Inserisci il titolo del quiz...',
        addQuestion: 'Aggiungi Domanda',
        publish: 'Pubblica',
        unpublish: 'Rimuovi',
        host: 'Ospita',
        share: 'Condividi',
        questions: 'Domande',
        noQuestions: 'Nessuna domanda ancora',
        addFirstQuestion: 'Aggiungi la tua prima domanda per iniziare',
        generateWithAi: 'Genera con IA',
        aiBulk: 'IA Massa',
        myQuizzesTitle: 'I Miei Quiz',
        noQuizzesYet: 'Nessun Quiz Ancora',
        createFirstQuiz: 'Crea il tuo primo quiz e condividilo con giocatori di tutto il mondo!',
        createYourFirstQuiz: 'Crea il Tuo Primo Quiz',
        creatorAccessRequired: 'Accesso Creatore Richiesto',
        creatorAccessDescription: "Hai bisogno dei permessi Creatore. Richiedi l'accesso dal tuo profilo.",
        goToProfile: 'Vai al Profilo',
        edit: 'Modifica',
        copy: 'Copia',
        delete: 'Elimina',
        deleteQuiz: 'Elimina Quiz',
        deleteConfirm: 'Sei sicuro di voler eliminare questo quiz? Questa azione non può essere annullata.',
        draft: 'Bozza',
        published: 'Pubblicato',
        finished: 'Terminato',
        questionText: 'Testo della Domanda',
        options: 'Opzioni',
        correctAnswer: 'Risposta Corretta',
        timeLimit: 'Limite di Tempo',
        pointValue: 'Valore Punti',
        saveQuestion: 'Salva Domanda',
        scanQrCode: 'Scansiona Codice QR',
        pointCamera: 'Punta la fotocamera verso il codice QR del quiz',
        cameraPermission: 'Permesso Fotocamera',
        cameraAccessDesc: 'Abbiamo bisogno dell_accesso alla fotocamera per scansionare i codici QR.',
        allowCamera: 'Consenti Accesso Fotocamera',
        enterManually: 'Inserisci Codice Manualmente',
        invalidQrCode: 'Codice QR Non Valido',
        invalidQrCodeMsg: 'Questo codice QR non sembra essere un codice quiz valido. Riprova.',
        tapToScan: 'Tocca per scansionare di nuovo',
        flash: 'Flash',
        close: 'Chiudi',
        loading: 'Caricamento...',
    },
    quiz: {
        question: 'Domanda',
        of: 'di',
        timeLeft: 'Tempo rimasto',
        submit: 'Invia',
        next: 'Avanti',
        finish: 'Fine',
        correct: 'Corretto!',
        incorrect: 'Sbagliato',
        points: 'punti',
        streak: 'serie',
        waiting: "In attesa dell'host...",
        starting: 'Avvio...',
        ended: 'Quiz Terminato',
        quizCode: 'Codice Quiz',
        leave: 'Esci',
        hostedBy: 'Ospitato da',
        questions: 'Domande',
        players: 'Giocatori',
        waitingForHost: "In attesa che l'host avvii il quiz...",
    },
    leaderboard: {
        title: 'Classifica',
        thisQuiz: 'Questo Quiz',
        weekly: 'Settimanale',
        allTime: 'Storico',
        noRankings: 'Nessuna Classifica Ancora',
        playToSee: 'Gioca un quiz per vedere la classifica!',
        joinQuiz: 'Unisciti a un Quiz',
        rank: 'Posizione',
        score: 'Punteggio',
        you: 'Tu',
    },
    profile: {
        title: 'Profilo',
        myQuizzes: 'I Miei Quiz',
        achievements: 'Obiettivi',
        stats: 'Statistiche',
        quizzesPlayed: 'Quiz Giocati',
        quizzesCreated: 'Quiz Creati',
        totalScore: 'Punteggio Totale',
        winRate: 'Tasso di Vittoria',
        displayName: 'Nome Visualizzato',
        changeName: 'Cambia Nome',
        changeAvatar: 'Cambia Avatar',
        editProfile: 'Modifica Profilo',
        level: 'Livello',
        xpToNextLevel: 'XP per prossimo livello',
        creatorTools: 'Strumenti Creatore',
        manageQuizzes: 'Crea e gestisci i tuoi quiz',
        chooseAvatar: 'Scegli Avatar',
        joiningAs: 'Unendosi come',
        enterCodeHint: 'Inserisci il codice a 6 cifre',
        connecting: 'Connessione al server...',
    },
    settings: {
        title: 'Impostazioni',
        language: 'Lingua',
        appLanguage: 'Lingua dell\'App',
        appearance: 'Aspetto',
        colorTheme: 'Tema Colore',
        aiProviders: 'Fornitori IA',
        aiProvidersHint: 'Configura le chiavi API per usare diversi modelli IA per la generazione di domande',
        about: 'Informazioni',
        version: 'Versione',
        proMember: 'Membro Pro',
        proFeatures: 'Hai accesso a tutte le funzionalità premium',
        apiKeyRequired: 'Chiave API richiesta',
        addKey: 'Aggiungi Chiave',
        savedKey: 'La chiave API è stata salvata',
        notSet: 'Non impostato',
        supportedModels: 'Modelli supportati',
        aboutApp: 'KWIZ è una piattaforma quiz multigiocatore in tempo reale. Crea quiz personalizzati, ospita sessioni dal vivo e sfida gli amici con domande generate dall\'IA.',
    },
    themes: {
        warmBrown: 'Marrone Caldo',
        oceanNight: 'Notte Oceanica',
        forest: 'Foresta',
        purpleNight: 'Notte Viola',
        sunset: 'Tramonto',
    },
    alerts: {
        publishFirst: 'Pubblica Prima',
        publishFirstMessage: 'Per favore pubblica il tuo quiz prima di ospitarlo.',
        quizNotFound: 'Quiz non trovato',
        connectionError: 'Errore di connessione. Controlla la tua connessione internet.',
        invalidCode: 'Codice quiz non valido',
        incompleteQuestions: 'Per favore completa tutte le domande prima di pubblicare',
        quizPublished: 'Quiz Pubblicato!',
        quizLive: 'Quiz in Diretta!',
        copied: 'Copiato negli appunti!',
    },
    features: {
        liveQuizzes: 'Quiz in Diretta',
        liveQuizzesDesc: 'Ospita quiz in tempo reale con gli amici',
        aiQuestions: 'Domande IA',
        aiQuestionsDesc: 'Genera domande istantaneamente con l\'IA',
        instantFeedback: 'Feedback Istantaneo',
        instantFeedbackDesc: 'Vedi i risultati in tempo reale',
        leaderboards: 'Classifiche',
        leaderboardsDesc: 'Competi e segui le posizioni',
        realTimeQuiz: 'Quiz in Tempo Reale',
        realTimeQuizDesc: 'Quiz multigiocatore con punteggio istantaneo',
        qrCodeJoin: 'Unisciti con QR',
        qrCodeJoinDesc: 'Scansiona per unirti istantaneamente',
        globalPlayers: 'Giocatori Globali',
        globalPlayersDesc: 'Sfida giocatori da tutto il mondo',
        customQuestions: 'Domande Personalizzate',
        customQuestionsDesc: 'Crea i tuoi quiz illimitati',
        rewardsRankings: 'Ricompense e Classifiche',
        rewardsRankingsDesc: 'Guadagna XP, sblocca badge e scala la classifica',
        multipleCategories: 'Categorie Multiple',
        multipleCategoriesDesc: 'Educazione, intrattenimento, trivia, sport e altro',
        hostControls: 'Controlli Host',
        hostControlsDesc: 'Avanzamento auto o manuale - tu decidi',
        aiGenerator: 'Generatore Quiz IA',
        aiGeneratorDesc: 'Lascia che l\'IA crei domande su qualsiasi argomento',
        guestMode: 'Modalità Ospite',
        guestModeDesc: 'Unisciti senza registrazione - gioca subito',
    },
};

// Portuguese translations
const pt: Translations = {
    common: {
        back: 'Voltar',
        cancel: 'Cancelar',
        save: 'Salvar',
        delete: 'Excluir',
        edit: 'Editar',
        confirm: 'Confirmar',
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        ok: 'OK',
        yes: 'Sim',
        no: 'Não',
    },
    nav: {
        home: 'Início',
        profile: 'Perfil',
        settings: 'Configurações',
        leaderboard: 'Ranking',
    },
    home: {
        welcome: 'Bem-vindo ao KWIZ',
        tagline: 'Crie e Jogue Quizzes Interativos',
        joinQuiz: 'Entrar no Quiz',
        createQuiz: 'Criar Quiz',
        enterCode: 'Inserir Código',
        leaderboard: 'Ranking',
        scanQr: 'Escanear QR Code',
        orEnterCode: 'ou insira o código manualmente',
    },
    join: {
        title: 'Entrar no Quiz',
        enterCode: 'Insira o código do quiz',
        codePlaceholder: 'ABCD12',
        joinButton: 'Entrar',
        noQuizFound: 'Nenhum quiz encontrado com este código',
        joining: 'Entrando...',
    },
    create: {
        title: 'Criar Quiz',
        quizTitle: 'Título do Quiz',
        quizTitlePlaceholder: 'Insira o título do quiz...',
        addQuestion: 'Adicionar Pergunta',
        publish: 'Publicar',
        unpublish: 'Despublicar',
        host: 'Hospedar',
        share: 'Compartilhar',
        questions: 'Perguntas',
        noQuestions: 'Sem perguntas ainda',
        addFirstQuestion: 'Adicione sua primeira pergunta para começar',
        generateWithAi: 'Gerar com IA',
        aiBulk: 'IA em Massa',
        myQuizzesTitle: 'Meus Quizzes',
        noQuizzesYet: 'Sem Quizzes Ainda',
        createFirstQuiz: 'Crie seu primeiro quiz e compartilhe com jogadores do mundo todo!',
        createYourFirstQuiz: 'Crie Seu Primeiro Quiz',
        creatorAccessRequired: 'Acesso de Criador Necessário',
        creatorAccessDescription: 'Você precisa de permissões de Criador. Solicite acesso no seu perfil.',
        goToProfile: 'Ir para Perfil',
        edit: 'Editar',
        copy: 'Copiar',
        delete: 'Excluir',
        deleteQuiz: 'Excluir Quiz',
        deleteConfirm: 'Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.',
        draft: 'Rascunho',
        published: 'Publicado',
        finished: 'Finalizado',
        questionText: 'Texto da Pergunta',
        options: 'Opções',
        correctAnswer: 'Resposta Correta',
        timeLimit: 'Limite de Tempo',
        pointValue: 'Valor em Pontos',
        saveQuestion: 'Salvar Pergunta',
        scanQrCode: 'Escanear Código QR',
        pointCamera: 'Aponte sua câmera para o código QR do quiz',
        cameraPermission: 'Permissão de Câmera',
        cameraAccessDesc: 'Precisamos de acesso à câmera para escanear códigos QR.',
        allowCamera: 'Permitir Acesso à Câmera',
        enterManually: 'Inserir Código Manualmente',
        invalidQrCode: 'Código QR Inválido',
        invalidQrCodeMsg: 'Este código QR não parece ser um código de quiz válido. Tente novamente.',
        tapToScan: 'Toque para escanear novamente',
        flash: 'Flash',
        close: 'Fechar',
        loading: 'Carregando...',
    },
    quiz: {
        question: 'Pergunta',
        of: 'de',
        timeLeft: 'Tempo restante',
        submit: 'Enviar',
        next: 'Próximo',
        finish: 'Finalizar',
        correct: 'Correto!',
        incorrect: 'Incorreto',
        points: 'pontos',
        streak: 'sequência',
        waiting: 'Aguardando o anfitrião...',
        starting: 'Iniciando...',
        ended: 'Quiz Encerrado',
        quizCode: 'Código do Quiz',
        leave: 'Sair',
        hostedBy: 'Hospedado por',
        questions: 'Perguntas',
        players: 'Jogadores',
        waitingForHost: 'Aguardando o anfitrião iniciar o quiz...',
    },
    leaderboard: {
        title: 'Ranking',
        thisQuiz: 'Este Quiz',
        weekly: 'Semanal',
        allTime: 'Histórico',
        noRankings: 'Sem Rankings Ainda',
        playToSee: 'Jogue um quiz para ver o ranking!',
        joinQuiz: 'Entrar em um Quiz',
        rank: 'Posição',
        score: 'Pontuação',
        you: 'Você',
    },
    profile: {
        title: 'Perfil',
        myQuizzes: 'Meus Quizzes',
        achievements: 'Conquistas',
        stats: 'Estatísticas',
        quizzesPlayed: 'Quizzes Jogados',
        quizzesCreated: 'Quizzes Criados',
        totalScore: 'Pontuação Total',
        winRate: 'Taxa de Vitória',
        displayName: 'Nome de Exibição',
        changeName: 'Alterar Nome',
        changeAvatar: 'Alterar Avatar',
        editProfile: 'Editar Perfil',
        level: 'Nível',
        xpToNextLevel: 'XP para próximo nível',
        creatorTools: 'Ferramentas de Criador',
        manageQuizzes: 'Crie e gerencie seus quizzes',
        chooseAvatar: 'Escolher Avatar',
        joiningAs: 'Entrando como',
        enterCodeHint: 'Digite o código de 6 dígitos',
        connecting: 'Conectando ao servidor...',
    },
    settings: {
        title: 'Configurações',
        language: 'Idioma',
        appLanguage: 'Idioma do App',
        appearance: 'Aparência',
        colorTheme: 'Tema de Cor',
        aiProviders: 'Provedores de IA',
        aiProvidersHint: 'Configure chaves de API para usar diferentes modelos de IA na geração de perguntas',
        about: 'Sobre',
        version: 'Versão',
        proMember: 'Membro Pro',
        proFeatures: 'Você tem acesso a todos os recursos premium',
        apiKeyRequired: 'Chave de API necessária',
        addKey: 'Adicionar Chave',
        savedKey: 'A chave de API foi salva',
        notSet: 'Não definido',
        supportedModels: 'Modelos suportados',
        aboutApp: 'KWIZ é uma plataforma de quiz multijogador em tempo real. Crie quizzes personalizados, hospede sessões ao vivo e desafie amigos com perguntas geradas por IA.',
    },
    themes: {
        warmBrown: 'Marrom Quente',
        oceanNight: 'Noite Oceânica',
        forest: 'Floresta',
        purpleNight: 'Noite Roxa',
        sunset: 'Pôr do Sol',
    },
    alerts: {
        publishFirst: 'Publique Primeiro',
        publishFirstMessage: 'Por favor, publique seu quiz antes de hospedá-lo.',
        quizNotFound: 'Quiz não encontrado',
        connectionError: 'Erro de conexão. Verifique sua internet.',
        invalidCode: 'Código de quiz inválido',
        incompleteQuestions: 'Por favor, complete todas as perguntas antes de publicar',
        quizPublished: 'Quiz Publicado!',
        quizLive: 'Quiz ao Vivo!',
        copied: 'Copiado para a área de transferência!',
    },
    features: {
        liveQuizzes: 'Quizzes ao Vivo',
        liveQuizzesDesc: 'Hospede quizzes em tempo real com amigos',
        aiQuestions: 'Perguntas IA',
        aiQuestionsDesc: 'Gere perguntas instantaneamente com IA',
        instantFeedback: 'Feedback Instantâneo',
        instantFeedbackDesc: 'Veja resultados em tempo real',
        leaderboards: 'Rankings',
        leaderboardsDesc: 'Compita e acompanhe posições',
        realTimeQuiz: 'Quiz em Tempo Real',
        realTimeQuizDesc: 'Quiz multijogador com pontuação instantânea',
        qrCodeJoin: 'Entrar com QR',
        qrCodeJoinDesc: 'Escaneie para entrar instantaneamente',
        globalPlayers: 'Jogadores Globais',
        globalPlayersDesc: 'Desafie jogadores do mundo todo',
        customQuestions: 'Perguntas Personalizadas',
        customQuestionsDesc: 'Crie seus próprios quizzes ilimitados',
        rewardsRankings: 'Recompensas e Rankings',
        rewardsRankingsDesc: 'Ganhe XP, desbloqueie emblemas e suba no ranking',
        multipleCategories: 'Múltiplas Categorias',
        multipleCategoriesDesc: 'Educação, entretenimento, trivia, esportes e mais',
        hostControls: 'Controles de Host',
        hostControlsDesc: 'Avanço automático ou manual - você decide',
        aiGenerator: 'Gerador de Quiz IA',
        aiGeneratorDesc: 'Deixe a IA criar perguntas sobre qualquer tema',
        guestMode: 'Modo Convidado',
        guestModeDesc: 'Entre sem registro - jogue instantaneamente',
    },
};

// All translations
const translations: Record<Language, Translations> = {
    en,
    de,
    es,
    fr,
    it,
    pt,
};

// Get translations for a language
export const getTranslations = (language: Language): Translations => {
    return translations[language] || translations.en;
};

export default translations;
