import { Injectable } from '@angular/core';
import { IPost } from '../interfaces/post';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  // Dark Theme Palette matching the website
  private readonly BG_COLOR = [15, 23, 21]; // #0f1715
  private readonly ACCENT_COLOR = [168, 255, 181]; // #a8ffb5
  private readonly TEXT_MAIN = [255, 255, 255];
  private readonly TEXT_SECONDARY = [168, 255, 181]; // Mint for metadata
  private readonly TEXT_DIM = [100, 100, 100];
  private readonly WATERMARK_TEXT = 'powered by dreamcatcher';

  public exportPost(post: IPost): void {
    const doc = new jsPDF();
    this.renderSinglePost(doc, post);
    this.addWatermark(doc);
    doc.save(`Dream_${post.id}.pdf`);
  }

  public exportProfile(posts: IPost[], username: string): void {
    const doc = new jsPDF();
    
    this.drawBackground(doc);

    // Header for the whole journal
    doc.setFontSize(28);
    doc.setTextColor(this.ACCENT_COLOR[0], this.ACCENT_COLOR[1], this.ACCENT_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Dream Journal', 20, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text(`Explorer: @${username}`, 20, 47);
    doc.text(`Total Records: ${posts.length}`, 20, 54);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 61);
    
    doc.setDrawColor(this.ACCENT_COLOR[0], this.ACCENT_COLOR[1], this.ACCENT_COLOR[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 68, 190, 68);

    let startY = 85;

    posts.forEach((post, index) => {
      if (index > 0) {
        doc.addPage();
        this.drawBackground(doc);
        startY = 35; 
      }
      
      startY = this.renderPostContent(doc, post, startY);
    });

    this.addWatermark(doc);
    doc.save(`${username}_Dream_Journal.pdf`);
  }

  private renderSinglePost(doc: jsPDF, post: IPost): void {
    this.drawBackground(doc);
    this.renderPostContent(doc, post, 35);
  }

  private renderPostContent(doc: jsPDF, post: IPost, startY: number): number {
    let currentY = startY;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = 170;

    // Post Title
    doc.setFontSize(24);
    doc.setTextColor(this.ACCENT_COLOR[0], this.ACCENT_COLOR[1], this.ACCENT_COLOR[2]);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(post.title || 'Untitled Dream', contentWidth);
    doc.text(titleLines, margin, currentY);
    currentY += (titleLines.length * 10) + 8;

    // Metadata
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`CATEGORY / ${post.category.toUpperCase()}`, margin, currentY);
    currentY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`TIMESTAMP / ${new Date(post.created_at).toLocaleString()}`, margin, currentY);
    currentY += 8;
    
    if (post.hashtag_names?.length) {
      doc.setTextColor(this.ACCENT_COLOR[0], this.ACCENT_COLOR[1], this.ACCENT_COLOR[2]);
      doc.text(`KEYS / ${post.hashtag_names.map(t => '#' + t).join(' ')}`, margin, currentY);
      currentY += 12;
    } else {
      currentY += 4;
    }

    // Modern flat divider
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.1);
    doc.line(margin, currentY, 190, currentY);
    currentY += 15;

    // Content
    doc.setFontSize(11);
    doc.setTextColor(230, 230, 230);
    doc.setFont('helvetica', 'normal');
    
    const contentLines = doc.splitTextToSize(post.content, contentWidth);
    
    contentLines.forEach((line: string) => {
      if (currentY > pageHeight - 35) {
        doc.addPage();
        this.drawBackground(doc);
        currentY = 35;
      }
      doc.text(line, margin, currentY);
      currentY += 7;
    });

    return currentY + 25; 
  }

  private drawBackground(doc: jsPDF): void {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    doc.setFillColor(this.BG_COLOR[0], this.BG_COLOR[1], this.BG_COLOR[2]);
    doc.rect(0, 0, width, height, 'F');
  }

  private addWatermark(doc: jsPDF): void {
    const pageCount = doc.internal.pages.length - 1;
    const pageHeight = doc.internal.pageSize.height;
    
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'italic');
        doc.text(this.WATERMARK_TEXT, 105, pageHeight - 10, { align: 'center' });
    }
  }
}
