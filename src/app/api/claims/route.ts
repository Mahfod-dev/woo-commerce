import { NextRequest, NextResponse } from 'next/server';

// Structure de réclamation simulée
interface Claim {
  id: number;
  userId: number;
  orderId: number;
  type: string;
  description: string;
  status: 'pending' | 'in_review' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

// Stockage temporaire des réclamations (simulant une base de données)
let CLAIMS_DB: Claim[] = [
  {
    id: 1,
    userId: 1,
    orderId: 101,
    type: 'product_issue',
    description: 'Les écouteurs ne fonctionnent pas correctement.',
    status: 'resolved',
    createdAt: '2023-12-20T08:45:00',
    updatedAt: '2023-12-24T14:30:00',
  },
  {
    id: 2,
    userId: 1,
    orderId: 102,
    type: 'late_delivery',
    description: 'Ma commande n\'est pas arrivée dans les délais prévus.',
    status: 'in_review',
    createdAt: '2024-01-25T16:20:00',
    updatedAt: '2024-01-26T09:15:00',
  },
];

// Fonction utilitaire pour valider le token
function validateToken(token: string | null): number | null {
  if (!token) return null;
  
  // Simulation de validation de token
  if (token.startsWith('demo-token-')) {
    const userId = parseInt(token.split('-').pop() || '0');
    return userId > 0 ? userId : null;
  }
  
  return null;
}

// GET - Récupérer les réclamations de l'utilisateur
export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || null;
  const userId = validateToken(token);
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  // Filtrer les réclamations pour cet utilisateur
  const userClaims = CLAIMS_DB.filter(claim => claim.userId === userId);
  
  return NextResponse.json({ claims: userClaims });
}

// POST - Créer une nouvelle réclamation
export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || null;
  const userId = validateToken(token);
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { orderId, type, description } = body;
    
    // Validation basique
    if (!orderId || !type || !description) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    // Créer une nouvelle réclamation
    const newClaim: Claim = {
      id: CLAIMS_DB.length + 1,
      userId,
      orderId,
      type,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Ajouter à notre "base de données"
    CLAIMS_DB.push(newClaim);
    
    return NextResponse.json({ claim: newClaim }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la réclamation:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la demande' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une réclamation existante
export async function PUT(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || null;
  const userId = validateToken(token);
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, description } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de réclamation requis' },
        { status: 400 }
      );
    }
    
    // Trouver l'index de la réclamation
    const claimIndex = CLAIMS_DB.findIndex(claim => claim.id === id && claim.userId === userId);
    
    if (claimIndex === -1) {
      return NextResponse.json(
        { error: 'Réclamation non trouvée ou non autorisée' },
        { status: 404 }
      );
    }
    
    // On ne peut mettre à jour que les réclamations en attente ou en cours d'examen
    if (CLAIMS_DB[claimIndex].status === 'resolved') {
      return NextResponse.json(
        { error: 'Les réclamations résolues ne peuvent plus être modifiées' },
        { status: 400 }
      );
    }
    
    // Mettre à jour la réclamation
    CLAIMS_DB[claimIndex] = {
      ...CLAIMS_DB[claimIndex],
      description: description || CLAIMS_DB[claimIndex].description,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json({ claim: CLAIMS_DB[claimIndex] });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réclamation:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la demande' },
      { status: 500 }
    );
  }
}

// DELETE - Annuler une réclamation
export async function DELETE(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || null;
  const userId = validateToken(token);
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get('id') || '0');
  
  if (!id) {
    return NextResponse.json(
      { error: 'ID de réclamation requis' },
      { status: 400 }
    );
  }
  
  // Vérifier que la réclamation existe et appartient à l'utilisateur
  const claimIndex = CLAIMS_DB.findIndex(claim => claim.id === id && claim.userId === userId);
  
  if (claimIndex === -1) {
    return NextResponse.json(
      { error: 'Réclamation non trouvée ou non autorisée' },
      { status: 404 }
    );
  }
  
  // On ne peut annuler que les réclamations en attente
  if (CLAIMS_DB[claimIndex].status !== 'pending') {
    return NextResponse.json(
      { error: 'Seules les réclamations en attente peuvent être annulées' },
      { status: 400 }
    );
  }
  
  // Supprimer la réclamation (ou la marquer comme annulée dans un cas réel)
  CLAIMS_DB = CLAIMS_DB.filter(claim => !(claim.id === id && claim.userId === userId));
  
  return NextResponse.json({ success: true });
}