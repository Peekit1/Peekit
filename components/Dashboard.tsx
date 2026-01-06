// Dans App.tsx, ajoute cette fonction avant le return
const handleUpdateProfile = async (updates: { studioName?: string; stagesConfig?: StagesConfiguration }) => {
    if (!session) return;
    try {
        const dbUpdates: any = {};
        if (updates.studioName) dbUpdates.studio_name = updates.studioName;
        if (updates.stagesConfig) dbUpdates.stages_config = updates.stagesConfig;

        const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', session.user.id);
        if (error) throw error;

        // Mise à jour de l'état local
        if (updates.studioName) setStudioName(updates.studioName);
        if (updates.stagesConfig) setStageConfig(updates.stagesConfig);
        
    } catch (error: any) {
        alert("Erreur de sauvegarde : " + error.message);
    }
};

// ... Puis dans le return, passe la prop au Dashboard :
if (session && currentPage === 'dashboard') {
    return <Dashboard 
        // ... autres props
        onUpdateProfile={handleUpdateProfile} // <--- AJOUT ICI
        // ...
    />;
}
