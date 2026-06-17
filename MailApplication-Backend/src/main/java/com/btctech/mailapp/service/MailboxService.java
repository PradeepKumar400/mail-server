package com.btctech.mailapp.service;

import com.btctech.mailapp.dto.CreateEmailRequest;
import com.btctech.mailapp.entity.Domain;
import com.btctech.mailapp.entity.MailAccount;
import com.btctech.mailapp.entity.User;
import com.btctech.mailapp.repository.DomainRepository;
import com.btctech.mailapp.repository.MailAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailboxService {

    private final MailAccountRepository mailAccountRepository;
    private final DomainRepository domainRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String MAILDIR_BASE = "/var/mail/vmail";

    /**
     * Create custom email account (called by Auth Server via API)
     */
    @Transactional
    public MailAccount createCustomEmail(User user, CreateEmailRequest request, String plainPassword) {

        log.info("🔄 [MAILBOX SERVICE] Starting mailbox creation for: {}", request.getEmailName());

        // Get domain
        Domain domain = domainRepository.findByDomain("btctech.shop")
                .orElseThrow(() -> new RuntimeException("Domain not found"));

        String fullEmail = request.getEmailName() + "@" + domain.getDomain();

        // Check if email exists
        if (mailAccountRepository.existsByEmail(fullEmail)) {
            throw new RuntimeException("Email already exists: " + fullEmail);
        }

        // Create mail account
        MailAccount mailAccount = new MailAccount();
        mailAccount.setUserId(user.getId());
        mailAccount.setDomainId(domain.getId());
        mailAccount.setEmailName(request.getEmailName());
        mailAccount.setEmail(fullEmail);
        mailAccount.setPassword(passwordEncoder.encode(plainPassword));

        // Maildir path
        String maildirPath = MAILDIR_BASE + "/" + domain.getDomain() + "/" + request.getEmailName() + "/";
        mailAccount.setMaildirPath(maildirPath);

        mailAccount.setActive(true);
        mailAccount.setIsPrimary(false);

        // Save to database
        MailAccount saved = mailAccountRepository.save(mailAccount);
        log.info("✅ [MAILBOX SERVICE] Mail account saved to database: {}", saved.getEmail());

        // Create maildir structure on filesystem
        try {
            createMaildirStructure(maildirPath);
            log.info("✅ [MAILBOX SERVICE] Maildir structure created: {}", maildirPath);
        } catch (IOException e) {
            log.error("❌ [MAILBOX SERVICE] Failed to create maildir: {}", e.getMessage());
            throw new RuntimeException("Failed to create maildir: " + e.getMessage());
        }

        log.info("🎉 [MAILBOX SERVICE] Mailbox fully created: {}", fullEmail);
        return saved;
    }

    /**
     * Create Maildir structure
     */
    private void createMaildirStructure(String maildirPath) throws IOException {
        Path basePath = Paths.get(maildirPath);
        Path curPath = basePath.resolve("cur");
        Path newPath = basePath.resolve("new");
        Path tmpPath = basePath.resolve("tmp");

        // Create directories
        Files.createDirectories(curPath);
        Files.createDirectories(newPath);
        Files.createDirectories(tmpPath);

        // Set permissions (700)
        Set<PosixFilePermission> perms = new HashSet<>();
        perms.add(PosixFilePermission.OWNER_READ);
        perms.add(PosixFilePermission.OWNER_WRITE);
        perms.add(PosixFilePermission.OWNER_EXECUTE);

        Files.setPosixFilePermissions(basePath, perms);
        Files.setPosixFilePermissions(curPath, perms);
        Files.setPosixFilePermissions(newPath, perms);
        Files.setPosixFilePermissions(tmpPath, perms);

        // Change ownership to vmail:vmail
        try {
            Runtime.getRuntime().exec(new String[] { "chown", "-R", "vmail:vmail", maildirPath });
            log.info("✅ Ownership changed to vmail:vmail for: {}", maildirPath);
        } catch (IOException e) {
            log.warn("⚠️ Could not change ownership (may need sudo): {}", e.getMessage());
        }
    }

    /**
     * Get mail account by email
     */
    public MailAccount getMailAccountByEmail(String email) {
        return mailAccountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email account not found: " + email));
    }

    /**
     * Get user's email accounts
     */
    public List<MailAccount> getUserEmails(Long userId) {
        return mailAccountRepository.findByUserId(userId);
    }

    /**
     * Set primary email
     */
    @Transactional
    public void setPrimaryEmail(Long userId, Long emailId) {
        // Unset all primary flags
        mailAccountRepository.findByUserId(userId).forEach(account -> {
            account.setIsPrimary(false);
            mailAccountRepository.save(account);
        });

        // Set new primary
        MailAccount account = mailAccountRepository.findById(emailId)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if (!account.getUserId().equals(userId)) {
            throw new RuntimeException("Email does not belong to user");
        }

        account.setIsPrimary(true);
        mailAccountRepository.save(account);
    }

    /**
     * Get primary email
     */
    public MailAccount getPrimaryEmail(Long userId) {
        return mailAccountRepository.findByUserIdAndIsPrimary(userId, true)
                .orElseThrow(() -> new RuntimeException("No primary email found"));
    }
}