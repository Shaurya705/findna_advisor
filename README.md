# FinVoice - AI-Powered Financial Management Platform

FinVoice is a comprehensive AI-powered financial management and advisory platform that helps businesses and individuals manage their finances through intelligent automation, analytics, and insights.

## 🚀 Features

### Core Functionality
- **📊 Unified Financial Dashboard** - Real-time overview of financial health
- **🧾 Invoice Management** - OCR-powered invoice processing and tracking
- **💰 Transaction Management** - Automated categorization and analysis
- **📈 Expense Tracking** - Smart expense management with project codes
- **🔮 AI Financial Forecasting** - ML-based cash flow predictions
- **🤖 AI Advisory Chat** - Intelligent financial advice and insights
- **🔍 Anomaly Detection** - Fraud detection and unusual pattern identification
- **📊 Advanced Analytics** - Comprehensive financial reports and insights

### AI & ML Capabilities
- **FinBERT** for financial sentiment analysis
- **Prophet & XGBoost** for time series forecasting
- **Isolation Forest** for anomaly detection
- **Tesseract OCR** for document text extraction
- **GPT Integration** for intelligent advisory services

### Technical Features
- **JWT Authentication** with role-based access control
- **RESTful API** with comprehensive documentation
- **Real-time Processing** with Celery task queues
- **Multi-currency Support** with exchange rate handling
- **Bulk Operations** for efficient data import/export
- **Audit Logging** for compliance and security

## 🏗️ Architecture

```
├── Frontend (React.js + TailwindCSS)
│   ├── Dashboard Components
│   ├── Transaction Management
│   ├── Invoice Processing
│   ├── Analytics & Reports
│   └── AI Chat Interface
│
├── Backend (FastAPI + Python)
│   ├── Authentication & Authorization
│   ├── File Upload & OCR Processing
│   ├── Financial Analysis Engine
│   ├── ML Forecasting Service
│   ├── AI Advisory Service
│   └── Background Task Processing
│
├── Database (PostgreSQL)
│   ├── User Management
│   ├── Financial Data Models
│   ├── Audit Logs
│   └── Analytics Storage
│
└── Infrastructure
    ├── Redis (Caching & Task Queue)
    ├── Celery (Background Processing)
    └── Docker (Containerization)
```

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and task queue
- **Celery** - Background task processing
- **Alembic** - Database migrations

### AI/ML Libraries
- **scikit-learn** - Machine learning algorithms
- **prophet** - Time series forecasting
- **xgboost** - Gradient boosting
- **transformers** - FinBERT integration
- **pytesseract** - OCR processing
- **openai** - GPT API integration

### Frontend
- **React.js** - UI framework
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Chart.js** - Data visualization

## 📋 Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 14+**
- **Redis 6+**
- **Docker & Docker Compose** (optional)

## 🚀 Quick Start with Docker

1. **Clone the repository**
```bash
git clone <repository-url>
cd findna_advisor
```

2. **Set environment variables**
```bash
# Create .env file
cp .env.example .env

# Edit .env file with your settings
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🔧 Manual Installation

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For development
```

4. **Set up environment variables**
```bash
# Create .env file in backend directory
DATABASE_URL=postgresql://user:password@localhost:5432/finvoice
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
```

5. **Set up database**
```bash
# Create database
createdb finvoice

# Run migrations
alembic upgrade head
```

6. **Start the backend server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

7. **Start Celery worker (in another terminal)**
```bash
celery -A app.tasks worker --loglevel=info
```

### Frontend Setup

1. **Navigate to project root**
```bash
cd ..  # Back to project root
```

2. **Install dependencies**
```bash
npm install
```

3. **Set environment variables**
```bash
# Create .env file in project root
REACT_APP_API_URL=http://localhost:8000
```

4. **Start the frontend**
```bash
npm start
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_api.py
```

### Run with pytest
```bash
cd backend
pytest
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/token` - Login and get access token
- `GET /api/auth/me` - Get current user info

#### Financial Management
- `GET /api/dashboard/overview` - Financial dashboard
- `POST /api/upload/invoice` - Upload and process invoices
- `GET /api/transactions` - List transactions
- `POST /api/analyze/transactions` - Analyze transactions
- `GET /api/forecast/cashflow` - Get cash flow forecast
- `POST /api/advice/chat` - AI financial advice

#### Data Management
- `GET /api/expenses` - List expenses
- `POST /api/transactions/bulk/import` - Bulk import
- `GET /api/dashboard/financial-health` - Financial health score

## 🔒 Security Features

- **JWT-based authentication** with token expiration
- **Password hashing** using bcrypt
- **Role-based access control** (Admin, User)
- **Input validation** with Pydantic schemas
- **SQL injection protection** with SQLAlchemy ORM
- **CORS configuration** for frontend integration
- **Audit logging** for all financial operations

## 📈 AI/ML Features

### OCR Processing
- Extract text from invoices and receipts
- Parse GST numbers, amounts, and dates
- Support for multiple image formats

### Anomaly Detection
- Identify unusual transaction patterns
- Detect potential fraud indicators
- Risk-based categorization

### Financial Forecasting
- Cash flow predictions using Prophet and XGBoost
- Confidence intervals and uncertainty quantification
- Seasonal pattern recognition

### AI Advisory
- Context-aware financial advice
- Integration with OpenAI GPT models
- Personalized recommendations

## 🚀 Deployment

### Production Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/finvoice

# Security
SECRET_KEY=your-super-secret-key-256-bits
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External APIs
OPENAI_API_KEY=your-openai-api-key

# Environment
ENVIRONMENT=production
DEBUG=False
```

### Docker Production Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose exec backend alembic upgrade head

# Create admin user
docker-compose exec backend python scripts/create_admin.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent web framework
- **React** team for the UI framework
- **Hugging Face** for FinBERT model
- **Facebook Prophet** for time series forecasting
- **OpenAI** for GPT integration

## 📞 Support

For support, email support@finvoice.com or create an issue in the repository.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core financial management features
- ✅ AI-powered OCR and analysis
- ✅ Basic forecasting and advisory

### Phase 2 (Next)
- 📱 Mobile app development
- 🔗 Bank API integrations
- 📊 Advanced analytics dashboard
- 🌍 Multi-language support

### Phase 3 (Future)
- 🤖 Advanced AI features
- 📈 Investment portfolio management
- 🏢 Multi-tenant support
- 🔐 Enhanced security features

---

**FinVoice** - Empowering financial decisions with AI intelligence.
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new

## Backend (FastAPI + PostgreSQL + Celery)

Quick start:

1. Copy `backend/.env.example` to `backend/.env` and adjust values.
2. Create a Python venv, then install: `pip install -r backend/requirements.txt`.
3. From the `backend/` folder, run the API: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`.
4. Optional: start a worker (needs Redis): `celery -A app.tasks.app worker --loglevel=info`.

APIs:
- POST /auth/token (JWT)
- POST /api/upload (invoice file -> OCR preview + job id)
- POST /api/analyze (transactions -> anomalies)
- POST /api/forecast (revenue -> forecast series)
- POST /api/advice (chat-based advisory stub)

Database tables (via SQLAlchemy): users, invoices, transactions, expenses, payments, audit_logs.
