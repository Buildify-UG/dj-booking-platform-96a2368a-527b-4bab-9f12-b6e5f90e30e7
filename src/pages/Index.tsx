import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Music, DollarSign, Download, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Sample data
const SAMPLE_DJS = [
  {
    id: 1,
    name: 'DJ Sonic',
    genres: ['House', 'Techno', 'Deep House'],
    hourlyRate: 500,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=300&fit=crop',
    bookedDates: ['2026-09-20', '2026-09-21', '2026-09-25'],
  },
  {
    id: 2,
    name: 'DJ Luna',
    genres: ['Hip-Hop', 'R&B', 'Trap'],
    hourlyRate: 450,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
    bookedDates: ['2026-09-22', '2026-09-23'],
  },
  {
    id: 3,
    name: 'DJ Phoenix',
    genres: ['Afrobeats', 'Amapiano', 'Gqom'],
    hourlyRate: 600,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    bookedDates: ['2026-09-24', '2026-09-26'],
  },
];

interface Quotation {
  djId: number;
  djName: string;
  hours: number;
  hourlyRate: number;
  date: string;
  total: number;
}

const Index = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [adminDJs, setAdminDJs] = useState(SAMPLE_DJS);
  const [newDJ, setNewDJ] = useState({ name: '', genres: '', hourlyRate: 0 });
  const [activeTab, setActiveTab] = useState<'browse' | 'quotations' | 'admin'>('browse');

  const handleRequestQuote = (djId: number, hours: string, date: string) => {
    const dj = adminDJs.find(d => d.id === djId);
    if (!dj || !hours || !date) return;

    const quote: Quotation = {
      djId,
      djName: dj.name,
      hours: parseInt(hours),
      hourlyRate: dj.hourlyRate,
      date,
      total: parseInt(hours) * dj.hourlyRate,
    };
    setQuotations([...quotations, quote]);
  };

  const handleAddDJ = () => {
    if (!newDJ.name || !newDJ.genres || newDJ.hourlyRate <= 0) return;
    const dj = {
      id: Math.max(...adminDJs.map(d => d.id), 0) + 1,
      name: newDJ.name,
      genres: newDJ.genres.split(',').map(g => g.trim()),
      hourlyRate: newDJ.hourlyRate,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      bookedDates: [],
    };
    setAdminDJs([...adminDJs, dj]);
    setNewDJ({ name: '', genres: '', hourlyRate: 0 });
  };

  const downloadInvoice = async (quote: Quotation) => {
    const element = document.getElementById(`invoice-${quote.djId}-${quote.date}`);
    if (!element) return;

    const canvas = await html2canvas(element);
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 277);
    pdf.save(`invoice-${quote.djName}-${quote.date}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 pt-safe">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between mb-3 md:mb-0">
            <div className="flex items-center gap-2 md:gap-3">
              <Music className="w-6 md:w-8 h-6 md:h-8 text-purple-600" />
              <h1 className="text-lg md:text-2xl font-bold text-slate-900">DJ Booking</h1>
            </div>
          </div>
          <div className="flex gap-1 md:gap-2 flex-wrap">
            <Button 
              variant={activeTab === 'browse' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('browse')}
              className="text-xs md:text-sm"
            >
              Browse
            </Button>
            <Button 
              variant={activeTab === 'quotations' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('quotations')}
              className="text-xs md:text-sm"
            >
              Quotes
            </Button>
            <Button 
              variant={activeTab === 'admin' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('admin')}
              className="text-xs md:text-sm"
            >
              Admin
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Browse DJs Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-4 md:space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2">Available DJs</h2>
              <p className="text-sm md:text-base text-slate-600">Browse and book professional DJs for your event</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {adminDJs.map(dj => (
                <Card key={dj.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={dj.image} alt={dj.name} className="w-full h-48 object-cover" />
                  <CardHeader>
                    <CardTitle>{dj.name}</CardTitle>
                    <CardDescription className="flex flex-wrap gap-1 mt-2">
                      {dj.genres.map(g => (
                        <span key={g} className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                          {g}
                        </span>
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold text-slate-900">R{dj.hourlyRate}/hour</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile & Book
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{dj.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-semibold">Genres</Label>
                            <p className="text-sm text-slate-600">{dj.genres.join(', ')}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold">Hourly Rate</Label>
                            <p className="text-2xl font-bold text-purple-600">R{dj.hourlyRate}</p>
                          </div>
                          <div>
                            <Label htmlFor={`date-${dj.id}`} className="text-sm font-semibold">
                              Select Date
                            </Label>
                            <Input id={`date-${dj.id}`} type="date" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor={`hours-${dj.id}`} className="text-sm font-semibold">
                              Number of Hours
                            </Label>
                            <Input id={`hours-${dj.id}`} type="number" min="1" max="12" placeholder="2" className="mt-1" />
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => {
                              const date = (document.getElementById(`date-${dj.id}`) as HTMLInputElement)?.value;
                              const hours = (document.getElementById(`hours-${dj.id}`) as HTMLInputElement)?.value;
                              if (date && hours) {
                                handleRequestQuote(dj.id, hours, date);
                                setActiveTab('quotations');
                              }
                            }}
                          >
                            Request Quotation
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quotations Tab */}
        {activeTab === 'quotations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Quotations</h2>
              <p className="text-slate-600">View and download your booking quotations</p>
            </div>

            {quotations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No quotations yet. Browse DJs and request a quotation to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {quotations.map((quote, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{quote.djName}</CardTitle>
                          <CardDescription>{quote.date}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => downloadInvoice(quote)}>
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                          <Label className="text-xs text-slate-600">Duration</Label>
                          <p className="text-lg font-semibold text-slate-900">{quote.hours} hours</p>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-600">Rate</Label>
                          <p className="text-lg font-semibold text-slate-900">R{quote.hourlyRate}/hr</p>
                        </div>
                        <div>
                          <Label className="text-xs text-slate-600">Total</Label>
                          <p className="text-lg font-semibold text-purple-600">R{quote.total}</p>
                        </div>
                      </div>

                      {/* Hidden Invoice for PDF */}
                      <div id={`invoice-${quote.djId}-${quote.date}`} className="hidden p-8 bg-white">
                        <div className="text-center mb-8">
                          <h1 className="text-3xl font-bold">INVOICE</h1>
                          <p className="text-slate-600">DJ Booking Hub</p>
                        </div>
                        <div className="mb-8">
                          <p className="font-semibold">DJ: {quote.djName}</p>
                          <p className="text-slate-600">Date: {quote.date}</p>
                        </div>
                        <table className="w-full mb-8 border-collapse">
                          <thead>
                            <tr className="border-b-2">
                              <th className="text-left py-2">Description</th>
                              <th className="text-right py-2">Hours</th>
                              <th className="text-right py-2">Rate</th>
                              <th className="text-right py-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2">{quote.djName} - DJ Services</td>
                              <td className="text-right">{quote.hours}</td>
                              <td className="text-right">R{quote.hourlyRate}</td>
                              <td className="text-right font-semibold">R{quote.total}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="flex justify-end mb-8">
                          <div className="w-48">
                            <div className="flex justify-between border-t-2 pt-2">
                              <span className="font-semibold">TOTAL:</span>
                              <span className="font-bold text-lg">R{quote.total}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center text-xs text-slate-600">
                          <p>Generated on {new Date().toLocaleDateString()}</p>
                          <p>Thank you for booking with DJ Booking Hub</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">DJ Management</h2>
              <p className="text-slate-600">Add, edit, and manage DJ profiles and availability</p>
            </div>

            {/* Add New DJ */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New DJ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">DJ Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. DJ Sonic"
                      value={newDJ.name}
                      onChange={e => setNewDJ({ ...newDJ, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="genres">Genres (comma-separated)</Label>
                    <Input
                      id="genres"
                      placeholder="House, Techno, Deep House"
                      value={newDJ.genres}
                      onChange={e => setNewDJ({ ...newDJ, genres: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate">Hourly Rate (R)</Label>
                    <Input
                      id="rate"
                      type="number"
                      placeholder="500"
                      value={newDJ.hourlyRate || ''}
                      onChange={e => setNewDJ({ ...newDJ, hourlyRate: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button onClick={handleAddDJ} className="w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add DJ
                </Button>
              </CardContent>
            </Card>

            {/* DJ List */}
            <div className="grid gap-4">
              {adminDJs.map(dj => (
                <Card key={dj.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900">{dj.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">{dj.genres.join(', ')}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600">R{dj.hourlyRate}/hour</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600">{dj.bookedDates.length} bookings</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
