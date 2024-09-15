export  const circuit = {
    NBR_1:'../circuits/Filtre_passe_bas.png',
    NBR_2:'../circuits/Filtre_passe_haut.png',
    NBR_3:'../circuits/Oscillateur.png',
    NBR_4:'../circuits/Rlc_en_parallele.png',
    NBR_5:'../circuits/Rlc_en_serie.png'
}

export function    eq_diff(t, key)
{
    switch (key)
    {
        case 'NBR_1':
            return (Math.sin(t * 0.2));
        case 'NBR_2':
            return (Math.cos(t * 0.2));
        case 'NBR_3':
            return (Math.tan(t * 0.5));
        case 'NBR_4':
            return (Math.exp(t * 0.3));
        case 'NBR_5':
            return (Math.cos(t)  / Math.sin(t * 0.5));
        default:
            return (Math.sin(t * 0.2));
    }
}